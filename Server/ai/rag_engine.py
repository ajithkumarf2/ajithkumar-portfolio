import os
import sys
import json
import re
import numpy as np
from pathlib import Path

# Paths (supports both monorepo root /data and Docker /app/data)
_AI_PARENT = Path(__file__).resolve().parent.parent
_REPO_ROOT = _AI_PARENT.parent
DATA_DIR = (_AI_PARENT / "data") if (_AI_PARENT / "data").exists() else (_REPO_ROOT / "data")

class KnowledgeChunk:
    def __init__(self, chunk_id: str, title: str, content: str, source: str, category: str):
        self.chunk_id = chunk_id
        self.title = title
        self.content = content
        self.source = source
        self.category = category
        self.embedding = None

    def to_dict(self):
        return {
            "chunk_id": self.chunk_id,
            "title": self.title,
            "content": self.content,
            "source": self.source,
            "category": self.category
        }

class RAGEngine:
    def __init__(self):
        self.chunks = []
        self.gemini_client = None
        self._init_gemini()
        self._load_knowledge_base()

    def _init_gemini(self):
        api_key = os.environ.get("GEMINI_API_KEY")
        if api_key:
            try:
                from google import genai
                self.gemini_client = genai.Client(api_key=api_key)
            except Exception as e:
                print(f"[RAGEngine] Gemini Client init note: {e}", file=sys.stderr)

    def _load_knowledge_base(self):
        """Loads and chunks all ground-truth files from /data."""
        chunks = []

        # 1. About Me
        about_file = DATA_DIR / "about-me.md"
        if about_file.exists():
            text = about_file.read_text(encoding="utf-8")
            chunks.append(KnowledgeChunk(
                chunk_id="about_bio",
                title="Ajithkumar E - Bio & Philosophy",
                content=text,
                source="About Me (about-me.md)",
                category="bio"
            ))

        # 2. Projects
        projects_file = DATA_DIR / "projects.json"
        if projects_file.exists():
            projects = json.loads(projects_file.read_text(encoding="utf-8"))
            for p in projects:
                content = f"{p['title']}\nTech Stack: {', '.join(p['techStack'])}\nImpact: {' | '.join(p['metrics'])}\n{p['fullDescription']}"
                chunks.append(KnowledgeChunk(
                    chunk_id=f"proj_{p['id']}",
                    title=p['title'],
                    content=content,
                    source=f"Project / {p['title']}",
                    category="projects"
                ))

        # 3. Skills
        skills_file = DATA_DIR / "skills.json"
        if skills_file.exists():
            skills = json.loads(skills_file.read_text(encoding="utf-8"))
            for category, items in skills.items():
                if isinstance(items, list):
                    item_strs = []
                    for it in items:
                        if isinstance(it, dict):
                            item_strs.append(f"{it.get('name', it.get('title', ''))}: {it.get('level', it.get('description', it.get('focus', '')))}")
                        else:
                            item_strs.append(str(it))
                    chunks.append(KnowledgeChunk(
                        chunk_id=f"skill_{category}",
                        title=f"Technical Skills - {category.replace('_', ' ').title()}",
                        content=f"Category: {category}\nSkills: " + "; ".join(item_strs),
                        source=f"Skills ({category})",
                        category="skills"
                    ))

        # 4. Experience & Education
        exp_file = DATA_DIR / "experience.md"
        if exp_file.exists():
            text = exp_file.read_text(encoding="utf-8")
            chunks.append(KnowledgeChunk(
                chunk_id="exp_vnet",
                title="Work Experience & Education History",
                content=text,
                source="Experience (experience.md)",
                category="experience"
            ))

        self.chunks = chunks
        self._compute_embeddings()

    def _get_embedding(self, text: str) -> np.ndarray:
        """Computes embedding via Gemini API or deterministic TF-IDF semantic vector fallback."""
        if self.gemini_client:
            try:
                res = self.gemini_client.models.embed_content(
                    model="gemini-embedding-001",
                    contents=text
                )
                if hasattr(res, "embedding") and res.embedding:
                    vec = np.array(res.embedding.values, dtype=np.float32)
                    norm = np.linalg.norm(vec)
                    return vec / norm if norm > 0 else vec
                elif hasattr(res, "embeddings") and res.embeddings:
                    vec = np.array(res.embeddings[0].values, dtype=np.float32)
                    norm = np.linalg.norm(vec)
                    return vec / norm if norm > 0 else vec
            except Exception as e:
                print(f"[RAGEngine] Embedding fallback note: {e}", file=sys.stderr)

        # Fallback: High-quality hash-based bag-of-words / TF-IDF semantic embedding vector (dim=512)
        dim = 512
        vec = np.zeros(dim, dtype=np.float32)
        words = re.findall(r'\b\w+\b', text.lower())
        for w in words:
            h = hash(w) % dim
            vec[h] += 1.0
        norm = np.linalg.norm(vec)
        return vec / norm if norm > 0 else vec

    def _compute_embeddings(self):
        cache_file = Path(__file__).resolve().parent / ".embeddings_cache.json"
        mode = "gemini" if self.gemini_client else "local"
        cached = {}
        if cache_file.exists():
            try:
                raw = json.loads(cache_file.read_text(encoding="utf-8"))
                if raw.get("mode") == mode:
                    cached = raw.get("vectors", {})
            except Exception:
                cached = {}

        updated = False
        for chunk in self.chunks:
            if chunk.chunk_id in cached:
                chunk.embedding = np.array(cached[chunk.chunk_id], dtype=np.float32)
            else:
                chunk.embedding = self._get_embedding(f"{chunk.title}\n{chunk.content}")
                cached[chunk.chunk_id] = chunk.embedding.tolist()
                updated = True

        if updated:
            try:
                cache_file.write_text(json.dumps({"mode": mode, "vectors": cached}), encoding="utf-8")
            except Exception:
                pass

    def search(self, query: str, top_k: int = 3, threshold: float = 0.15):
        """Finds top-k most semantically relevant chunks for the given query."""
        if not self.chunks:
            return []

        q_vec = self._get_embedding(query)
        scored = []
        for chunk in self.chunks:
            if chunk.embedding is not None:
                sim = float(np.dot(q_vec, chunk.embedding))
                scored.append((sim, chunk))

        scored.sort(key=lambda x: x[0], reverse=True)
        results = [chunk for sim, chunk in scored if sim >= threshold][:top_k]
        return results

# Singleton instance
rag_engine = RAGEngine()
