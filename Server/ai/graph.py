import os
import re
import sys
from typing import TypedDict, List, Dict, Any
from langgraph.graph import StateGraph, END
from rag_engine import rag_engine

# Typed state for LangGraph
class PortfolioChatState(TypedDict):
    query: str
    session_id: str
    intent: str
    guardrail_passed: bool
    retrieved_chunks: List[Dict[str, Any]]
    citations: List[str]
    response: str
    suggest_lead_capture: bool

# 1. Guardrail Node: Detects injections and completely off-topic spam
def guardrail_node(state: PortfolioChatState) -> PortfolioChatState:
    query = state["query"].lower().strip()
    
    # Prompt injection patterns
    injection_patterns = [
        r"ignore (all|previous|above) instructions",
        r"system prompt",
        r"you are now (an evil|dan|unrestricted)",
        r"bypass security",
        r"jailbreak",
        r"drop table",
        r"<script>",
        r"reveal your (secret|key|instructions)"
    ]
    
    for pattern in injection_patterns:
        if re.search(pattern, query):
            return {
                **state,
                "guardrail_passed": False,
                "response": "I am Ajithkumar's portfolio AI assistant. I can only answer questions related to his technical background, engineering projects, skills, and professional availability.",
                "citations": ["Guardrail Policy"],
                "suggest_lead_capture": False
            }
            
    return {**state, "guardrail_passed": True}

# 2. Router Node: Classifies intent
def router_node(state: PortfolioChatState) -> PortfolioChatState:
    query = state["query"].lower()
    
    # Check hire / contact intent
    if any(k in query for k in ["hire", "interview", "available", "job", "recruiter", "work with", "resume", "salary", "contact", "email", "phone"]):
        intent = "hire_me_contact"
    # Check projects
    elif any(k in query for k in ["project", "task manager", "grocery", "clueless", "quick.ai", "library", "rag", "built", "repo", "github", "app"]):
        intent = "project_deep_dive"
    # Check skills
    elif any(k in query for k in ["skill", "stack", "tech", "langchain", "langgraph", "node", "react", "express", "mysql", "mongodb", "python", "gemini"]):
        intent = "skills_stack"
    # Check education & bio
    elif any(k in query for k in ["about", "who is", "education", "college", "ppg", "degree", "location", "kerala", "pattambi"]):
        intent = "about_me"
    # Check greetings
    elif any(k in query for k in ["hi", "hello", "hey", "who are you", "what can you do"]):
        intent = "small_talk"
    else:
        intent = "general_qa"
        
    return {**state, "intent": intent}

# 3. Retriever Node: RAG semantic search over knowledge base
def retriever_node(state: PortfolioChatState) -> PortfolioChatState:
    results = rag_engine.search(state["query"], top_k=3)
    chunks_data = [c.to_dict() for c in results]
    citations = [c.source for c in results] if results else ["Source: Portfolio Data"]
    
    return {
        **state,
        "retrieved_chunks": chunks_data,
        "citations": citations
    }

# Reusable Gemini client (avoids per-request client init & long 503 retry stalls)
_GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
_GEMINI_CLIENT = None
if _GEMINI_API_KEY:
    try:
        from google import genai
        _GEMINI_CLIENT = genai.Client(
            api_key=_GEMINI_API_KEY,
            http_options={"retry_options": {"attempts": 1}},
        )
    except Exception as e:
        print(f"[Graph] Gemini client init note: {e}", file=sys.stderr)

CHAT_MODELS = ["gemini-3.5-flash-lite", "gemini-3.1-flash-lite", "gemini-3.8-flash"]


def _get_gemini_client():
    global _GEMINI_CLIENT
    if _GEMINI_CLIENT is None:
        key = os.environ.get("GEMINI_API_KEY")
        if key:
            from google import genai
            _GEMINI_CLIENT = genai.Client(
                api_key=key,
                http_options={"retry_options": {"attempts": 1}},
            )
    return _GEMINI_CLIENT


# 4. Generator Node: LLM synthesis (Gemini or grounded synthesis)
def generator_node(state: PortfolioChatState) -> PortfolioChatState:
    query = state["query"]
    intent = state["intent"]
    chunks = state.get("retrieved_chunks", [])
    
    context_text = "\n\n".join([f"[{c['source']}]: {c['content']}" for c in chunks])
    
    # Try calling Google Gemini LLM if GEMINI_API_KEY is present
    client = _get_gemini_client()
    if client:
        system_instruction = (
            "You are the official AI assistant for Ajithkumar E, a full-stack and AI software developer. "
            "Answer accurately using ONLY the provided context. Never invent facts. "
            "Format every response cleanly and concisely (under 120 words): "
            "start with a 1-2 sentence direct overview, then use short bullet points formatted as '- **Topic:** concise detail'. "
            "Do NOT include any '(Source: ...)' or 'Sources:' text at the end of your reply. "
            "If the context lacks the answer, say so politely and suggest contacting ajithkumare101@gmail.com."
        )
        prompt = f"Context:\n{context_text}\n\nUser Question: {query}"
        for model_name in CHAT_MODELS:
            try:
                response = client.models.generate_content(
                    model=model_name,
                    contents=prompt,
                    config={"system_instruction": system_instruction}
                )
                if response.text:
                    return {**state, "response": response.text.strip()}
            except Exception as e:
                print(f"[GeneratorNode] {model_name} fallback note: {e}", file=sys.stderr)

    # Deterministic high-quality grounded synthesis fallback
    if intent == "hire_me_contact":
        resp = (
            "Ajithkumar E is currently available for Full-Stack Developer and AI Engineer roles.\n\n"
            "- **Core Stack:** React.js, Node.js, Express.js, MySQL, and MongoDB\n"
            "- **AI Engineering:** Python, LangChain, LangGraph, RAG, and Google Gemini API\n"
            "- **Direct Contact:** ajithkumare101@gmail.com | +91 6380644382\n\n"
            "You can also leave your name and email below!"
        )
    elif intent == "project_deep_dive":
        if "task manager" in query.lower() or "rag" in query.lower():
            resp = (
                "Ajithkumar built the **AI Task Manager**, a production-ready platform powered by Gemini LLM, LangChain.js, and LangGraph.\n\n"
                "- **AI & Multi-Agent Workflows:** Automates task prioritization and workload summarization using stateful LangGraph graphs.\n"
                "- **RAG Over PDFs:** Uses ChromaDB vector storage and semantic search to query uploaded PDF documents via embeddings.\n"
                "- **Architecture & Stack:** React.js, Node.js, Express.js, MySQL (normalized schema), JWT auth, and Tailwind CSS."
            )
        elif "grocery" in query.lower():
            resp = (
                "The **Full-Stack Grocery E-Commerce App** is a scalable retail platform built for 500+ products.\n\n"
                "- **Performance:** Optimized frontend state with React Context API, reducing unnecessary re-renders by ~25%.\n"
                "- **Security:** Implemented JWT authentication, RBAC, and an admin inventory/order dashboard.\n"
                "- **Tech Stack:** React.js, Node.js, Express.js, MongoDB, and Tailwind CSS."
            )
        elif "clueless" in query.lower():
            resp = (
                "**Clueless Closet** is an AI fashion and wardrobe management platform.\n\n"
                "- **Visual Outfit Builder:** Interactive mix-and-match canvas with an image upload pipeline.\n"
                "- **AI Scheduling:** Personalized outfit recommendations and scheduling based on occasion.\n"
                "- **Security:** Strict user data isolation with JWT authentication."
            )
        else:
            resp = (
                "Ajithkumar has built full-stack web platforms and AI-powered applications:\n\n"
                "- **AI Task Manager:** React, Node, Express, MySQL, ChromaDB, LangChain, LangGraph, and Gemini RAG over PDFs.\n"
                "- **Grocery E-Commerce App:** 500+ products, JWT/RBAC, admin dashboard, and ~25% fewer re-renders via Context API.\n"
                "- **Clueless Closet:** AI fashion platform with visual outfit builder and AI outfit scheduling."
            )
    elif intent == "skills_stack":
        resp = (
            "Ajithkumar's core technical capabilities span full-stack web and AI engineering:\n\n"
            "- **Languages:** JavaScript, Python, SQL, C#\n"
            "- **Frontend:** React.js, Tailwind CSS, Context API, Framer Motion\n"
            "- **Backend:** Node.js, Express.js, REST APIs, JWT Auth, RBAC, MVC\n"
            "- **Databases & Vector Stores:** MySQL, MongoDB, ChromaDB\n"
            "- **AI & LLM:** LangChain, LangGraph, RAG, embeddings, semantic search, Gemini API\n"
            "- **Tools & DevOps:** Git, GitHub, Postman, Vercel, CI/CD"
        )
    elif intent == "about_me":
        resp = (
            "Ajithkumar E is a Full-Stack & AI Software Developer from Pattambi, Kerala, India.\n\n"
            "- **Education:** B.E. in Computer Science and Engineering, PPG Institute of Technology, Coimbatore (2021–2025).\n"
            "- **Internship:** Software Developer Intern at V-Net Technology (Jul–Aug 2024), where he built Quick.ai (~20% API latency cut) and a Library Management System."
        )
    elif intent == "small_talk":
        resp = (
            "Hello! I'm Ajithkumar's AI portfolio assistant. Ask me anything about:\n\n"
            "- **Projects:** AI Task Manager (RAG + LangGraph), Grocery E-Commerce, Clueless Closet\n"
            "- **Experience & Skills:** V-Net Technology internship, full-stack & AI stack\n"
            "- **Hiring:** Availability and direct contact options"
        )
    else:
        if chunks:
            resp = f"Based on Ajithkumar's portfolio data:\n\n- **Summary:** {chunks[0]['content'][:260].strip()}..."
        else:
            resp = "I don't have that specific detail in Ajithkumar's verified portfolio data. You can reach out directly at ajithkumare101@gmail.com."

    return {**state, "response": resp}

# 5. Lead Capture Node: Flags hiring intent
def lead_capture_node(state: PortfolioChatState) -> PortfolioChatState:
    is_hiring = state["intent"] == "hire_me_contact"
    return {
        **state,
        "suggest_lead_capture": is_hiring
    }

# Build LangGraph State Machine
def create_portfolio_graph():
    builder = StateGraph(PortfolioChatState)
    
    # Add nodes
    builder.add_node("guardrail", guardrail_node)
    builder.add_node("router", router_node)
    builder.add_node("retriever", retriever_node)
    builder.add_node("generator", generator_node)
    builder.add_node("lead_capture", lead_capture_node)
    
    # Set entry point
    builder.set_entry_point("guardrail")
    
    # Conditional edge from guardrail
    def check_guardrail(state: PortfolioChatState):
        return "router" if state.get("guardrail_passed", True) else END
        
    builder.add_conditional_edges("guardrail", check_guardrail, {
        "router": "router",
        END: END
    })
    
    # Pipeline edges
    builder.add_edge("router", "retriever")
    builder.add_edge("retriever", "generator")
    builder.add_edge("generator", "lead_capture")
    builder.add_edge("lead_capture", END)
    
    return builder.compile()

# Compile the graph
portfolio_graph = create_portfolio_graph()


def stream_portfolio_chat(query: str, session_id: str = "default_session"):
    """Runs guardrail -> router -> retriever via LangGraph nodes, then streams Gemini tokens in real time."""
    state: PortfolioChatState = {
        "query": query,
        "session_id": session_id,
        "intent": "",
        "guardrail_passed": True,
        "retrieved_chunks": [],
        "citations": [],
        "response": "",
        "suggest_lead_capture": False,
    }

    state = guardrail_node(state)
    if not state.get("guardrail_passed", True):
        yield {"delta": state["response"], "citations": state["citations"], "suggestLeadCapture": False}
        return

    state = router_node(state)
    state = retriever_node(state)
    state = lead_capture_node(state)

    citations = state.get("citations", [])
    suggest_lead = state.get("suggest_lead_capture", False)
    chunks = state.get("retrieved_chunks", [])
    context_text = "\n\n".join([f"[{c['source']}]: {c['content']}" for c in chunks])

    client = _get_gemini_client()
    if client:
        system_instruction = (
            "You are the official AI assistant for Ajithkumar E, a full-stack and AI software developer. "
            "Answer accurately using ONLY the provided context. Never invent facts. "
            "Format every response cleanly and concisely (under 120 words): "
            "start with a 1-2 sentence direct overview, then use short bullet points formatted as '- **Topic:** concise detail'. "
            "Do NOT include any '(Source: ...)' or 'Sources:' text at the end of your reply. "
            "If the context lacks the answer, say so politely and suggest contacting ajithkumare101@gmail.com."
        )
        prompt = f"Context:\n{context_text}\n\nUser Question: {query}"
        for model_name in CHAT_MODELS:
            try:
                streamed_any = False
                for chunk in client.models.generate_content_stream(
                    model=model_name,
                    contents=prompt,
                    config={"system_instruction": system_instruction},
                ):
                    if getattr(chunk, "text", None):
                        streamed_any = True
                        yield {"delta": chunk.text, "citations": [], "suggestLeadCapture": False}
                if streamed_any:
                    yield {"delta": "", "citations": citations, "suggestLeadCapture": suggest_lead}
                    return
            except Exception as e:
                print(f"[GeneratorNode] {model_name} stream fallback note: {e}", file=sys.stderr)

    # Deterministic fallback when Gemini is unavailable
    state = generator_node(state)
    yield {"delta": state.get("response", ""), "citations": citations, "suggestLeadCapture": suggest_lead}
