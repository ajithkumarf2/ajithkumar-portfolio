import React, { useState } from 'react';
import { ExternalLink, Github, Zap, ArrowUpRight, Star, ChevronRight } from 'lucide-react';
import { PROJECTS } from './constants';

export default function Projects() {
  const [filter, setFilter] = useState('all');
  const [hovered, setHovered] = useState(null);

  const filteredProjects = filter === 'featured' ? PROJECTS.filter(p => p.featured) : PROJECTS;

  const techColors = {
    'React.js': 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-500/20',
    'Node.js': 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-300 border-green-200 dark:border-green-500/20',
    'Python': 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/20',
    'LangChain': 'bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-500/20',
    'LangGraph': 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-500/20',
    'Gemini API': 'bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-500/20',
    default: 'bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10',
  };

  const getChipClass = (tech) => techColors[tech] || techColors.default;

  return (
    <section id="projects" className="py-24 md:py-32 relative">
      <div className="absolute right-0 top-20 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full px-5 sm:px-8 lg:px-14 xl:px-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-4">
              <div className="w-8 h-[1.5px] bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" />
              04 &mdash; Featured Work
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              Projects built<br />
              <span className="bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">
                for impact.
              </span>
            </h2>
            <p className="mt-3 text-slate-500 dark:text-slate-400 text-base max-w-lg">
              Production web apps, full-stack platforms, and AI agent architectures.
            </p>
          </div>

          {/* Filter toggle */}
          <div className="flex items-center bg-white dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm self-start md:self-auto">
            {['all', 'featured'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                type="button"
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all capitalize ${
                  filter === f
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {f === 'all' ? `All (${PROJECTS.length})` : `⭐ Featured (${PROJECTS.filter(p => p.featured).length})`}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project, idx) => (
            <div
              key={project.id}
              onMouseEnter={() => setHovered(project.id)}
              onMouseLeave={() => setHovered(null)}
              className="group relative flex flex-col justify-between p-7 rounded-3xl border border-slate-200/80 dark:border-white/8 bg-white dark:bg-slate-800/60 hover:border-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/8 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              {/* Hover glow */}
              <div className={`absolute inset-0 bg-gradient-to-br from-emerald-500/3 to-teal-500/3 transition-opacity duration-300 ${hovered === project.id ? 'opacity-100' : 'opacity-0'}`} />

              <div className="relative space-y-5">
                {/* Top bar */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {project.featured && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-gradient-to-r from-emerald-500/15 to-teal-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                        <Star className="w-2.5 h-2.5 fill-current" /> Featured
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                      #{String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${project.title} GitHub`}
                      className="p-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
                    >
                      <Github className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${project.title} live demo`}
                      className="p-2 rounded-xl border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-tight mb-1">
                    {project.title}
                  </h3>
                  <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400">{project.subtitle}</p>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {project.description}
                </p>

                {/* Impact */}
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-500/8 dark:bg-emerald-500/10 border border-emerald-500/20">
                  <Zap className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 leading-relaxed">{project.impact}</span>
                </div>

                {/* Highlights */}
                <ul className="space-y-1.5">
                  {project.highlights.slice(0, 3).map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <ChevronRight className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Footer */}
              <div className="relative pt-5 mt-5 border-t border-slate-100 dark:border-white/5 space-y-4">
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono border transition-all hover:scale-105 ${getChipClass(tech)}`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-md shadow-emerald-500/20 transition-all hover:-translate-y-0.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                  </a>
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
                  >
                    <Github className="w-3.5 h-3.5" /> Source
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
