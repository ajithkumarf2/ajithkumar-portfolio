import React, { useState } from 'react';
import { Code, Server, Database, Brain, Wrench, BookOpen, Layers } from 'lucide-react';
import { SKILL_GROUPS } from './constants';

export default function Skills() {
  const [activeTab, setActiveTab] = useState('All');

  const categoryConfig = {
    'Languages':              { icon: <Code className="w-4 h-4" />,     color: 'emerald', accent: '#10B981' },
    'Frontend':               { icon: <Layers className="w-4 h-4" />,   color: 'cyan',    accent: '#06B6D4' },
    'Backend':                { icon: <Server className="w-4 h-4" />,   color: 'blue',    accent: '#3B82F6' },
    'Databases':              { icon: <Database className="w-4 h-4" />, color: 'violet',  accent: '#8B5CF6' },
    'AI & LLM Orchestration': { icon: <Brain className="w-4 h-4" />,   color: 'teal',    accent: '#14B8A6' },
    'Tools & DevOps':         { icon: <Wrench className="w-4 h-4" />,  color: 'amber',   accent: '#F59E0B' },
    'Core Computer Science':  { icon: <BookOpen className="w-4 h-4" />,color: 'rose',    accent: '#F43F5E' },
  };

  const colorClasses = {
    emerald: { bg: 'bg-emerald-500/10 dark:bg-emerald-500/15', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/20', chip: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-300', dot: 'bg-emerald-500' },
    cyan:    { bg: 'bg-cyan-500/10 dark:bg-cyan-500/15',       text: 'text-cyan-600 dark:text-cyan-400',       border: 'border-cyan-500/20',    chip: 'bg-cyan-50 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/20 text-cyan-700 dark:text-cyan-300',       dot: 'bg-cyan-500' },
    blue:    { bg: 'bg-blue-500/10 dark:bg-blue-500/15',       text: 'text-blue-600 dark:text-blue-400',       border: 'border-blue-500/20',    chip: 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-300',       dot: 'bg-blue-500' },
    violet:  { bg: 'bg-violet-500/10 dark:bg-violet-500/15',   text: 'text-violet-600 dark:text-violet-400',   border: 'border-violet-500/20',  chip: 'bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-500/20 text-violet-700 dark:text-violet-300', dot: 'bg-violet-500' },
    teal:    { bg: 'bg-teal-500/10 dark:bg-teal-500/15',       text: 'text-teal-600 dark:text-teal-400',       border: 'border-teal-500/20',    chip: 'bg-teal-50 dark:bg-teal-500/10 border-teal-200 dark:border-teal-500/20 text-teal-700 dark:text-teal-300',       dot: 'bg-teal-500' },
    amber:   { bg: 'bg-amber-500/10 dark:bg-amber-500/15',     text: 'text-amber-600 dark:text-amber-400',     border: 'border-amber-500/20',   chip: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-300',   dot: 'bg-amber-500' },
    rose:    { bg: 'bg-rose-500/10 dark:bg-rose-500/15',       text: 'text-rose-600 dark:text-rose-400',       border: 'border-rose-500/20',    chip: 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-300',       dot: 'bg-rose-500' },
  };

  const categories = ['All', ...SKILL_GROUPS.map(g => g.category)];
  const displayedGroups = activeTab === 'All' ? SKILL_GROUPS : SKILL_GROUPS.filter(g => g.category === activeTab);

  return (
    <section id="skills" className="py-24 md:py-32 bg-slate-50/60 dark:bg-slate-900/40 relative">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(#10B981 1px, transparent 1px), linear-gradient(90deg, #10B981 1px, transparent 1px)', backgroundSize: '48px 48px' }}
      />

      <div className="w-full px-5 sm:px-8 lg:px-14 xl:px-20 relative">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-4">
            <div className="w-8 h-[1.5px] bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" />
            02 &mdash; Technical Skills
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-3">
            What I work with.
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-base max-w-lg">
            A structured breakdown across frontend, backend, databases, and AI engineering.
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-10 no-scrollbar">
          {categories.map((cat) => {
            const cfg = categoryConfig[cat];
            const isActive = activeTab === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                type="button"
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/20'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-emerald-500/40 hover:text-emerald-600 dark:hover:text-emerald-400'
                }`}
              >
                {cfg && <span className={isActive ? 'text-white' : colorClasses[cfg.color]?.text}>{cfg.icon}</span>}
                {cat === 'All' ? '✦ All' : cat.length > 20 ? cat.split(' ')[0] + '…' : cat}
              </button>
            );
          })}
        </div>

        {/* Skill Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedGroups.map((group) => {
            const cfg = categoryConfig[group.category] || { color: 'emerald' };
            const c = colorClasses[cfg.color];
            return (
              <div
                key={group.category}
                className="group p-6 rounded-2xl border border-slate-200/80 dark:border-white/8 bg-white dark:bg-slate-800/60 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 transition-all duration-300"
              >
                {/* Card header */}
                <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-100 dark:border-white/5">
                  <div className={`p-2.5 rounded-xl border ${c.bg} ${c.border} ${c.text}`}>
                    {cfg.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                      {group.category}
                    </h3>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">
                      {group.skills.length} skills
                    </p>
                  </div>
                </div>

                {/* Skill chips */}
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-mono border transition-all hover:scale-105 ${c.chip}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dot}`} />
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400">{group.skills.length} competencies</span>
                  <span className={`text-[10px] font-bold font-mono ${c.text}`}>Production Ready</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
