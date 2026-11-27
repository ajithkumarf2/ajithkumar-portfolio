import React from 'react';
import { Layers, Bot, Database, ShieldCheck, ArrowRight, GraduationCap, Briefcase } from 'lucide-react';
import { OWNER_INFO } from './constants';

export default function About() {
  const highlights = [
    {
      icon: <Layers className="w-5 h-5" />,
      color: 'emerald',
      title: 'Full-Stack Engineering',
      description: 'React.js, Node.js, Express.js — end-to-end applications with clean MVC patterns, modular service layers, and efficient state management.'
    },
    {
      icon: <Bot className="w-5 h-5" />,
      color: 'teal',
      title: 'AI & Multi-Agent Systems',
      description: 'Python, LangChain, LangGraph, RAG — stateful AI agent workflows with retrieval-augmented generation over real document stores.'
    },
    {
      icon: <Database className="w-5 h-5" />,
      color: 'cyan',
      title: 'Databases & Vector Stores',
      description: 'MySQL, MongoDB, ChromaDB — normalized schemas, indexes, and semantic embeddings for intelligent search.'
    },
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      color: 'emerald',
      title: 'API Security & Auth',
      description: 'JWT tokens, role-based access control, rate limiting, Zod validation — defense-in-depth API protection.'
    }
  ];

  const colorMap = {
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 group-hover:bg-emerald-500/15',
    teal: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20 group-hover:bg-teal-500/15',
    cyan: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20 group-hover:bg-cyan-500/15',
  };

  return (
    <section id="about" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-emerald-500/30 to-transparent" />

      <div className="w-full px-5 sm:px-8 lg:px-14 xl:px-20">
        {/* Section Label */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            <div className="w-8 h-[1.5px] bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" />
            01 &mdash; About Me
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-start">
          {/* Left: Story */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              Building systems that
              <br />
              <span className="bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">
                think and scale.
              </span>
            </h2>

            <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed text-[15px]">
              <p>
                I'm a software developer from <strong className="text-slate-900 dark:text-white font-semibold">Pattambi, Kerala, India</strong>, completing my B.E. in Computer Science & Engineering at <strong className="text-slate-900 dark:text-white font-semibold">PPG Institute of Technology, Coimbatore</strong> (2021–2025).
              </p>
              <p>
                At <strong className="text-slate-900 dark:text-white font-semibold">V-Net Technology</strong>, I engineered core services for <strong className="text-slate-900 dark:text-white font-semibold">Quick.ai</strong> — an AI SaaS platform — cutting API latency by ~20% through async streaming, and built a Library Management System with real-time analytics serving 100+ records.
              </p>
              <p>
                Beyond traditional CRUD: I architect <strong className="text-slate-900 dark:text-white font-semibold">LangGraph stateful agent workflows</strong>, build RAG pipelines over vector stores, and engineer deterministic guardrails for production AI applications.
              </p>
            </div>

            {/* Timeline cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="group p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800/60 dark:to-slate-900/60 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/5 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">Education</span>
                </div>
                <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">2021–2025</div>
                <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-1">B.E. Computer Science</div>
                <div className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">PPG Institute of Technology</div>
              </div>

              <div className="group p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800/60 dark:to-slate-900/60 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/5 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">Experience</span>
                </div>
                <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">V-Net Tech</div>
                <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-1">Software Developer Intern</div>
                <div className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">Quick.ai · Library System</div>
              </div>
            </div>

            <a
              href="#experience"
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:gap-3 transition-all"
            >
              Full work history <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Right: Capability Cards */}
          <div className="lg:col-span-5 grid grid-cols-1 gap-3">
            {highlights.map((item, idx) => (
              <div
                key={idx}
                className="group flex items-start gap-4 p-5 rounded-2xl border border-slate-200/80 dark:border-white/8 bg-white/70 dark:bg-slate-800/40 hover:border-emerald-500/30 hover:bg-white dark:hover:bg-slate-800/70 hover:shadow-md transition-all duration-200"
              >
                <div className={`flex-shrink-0 p-2.5 rounded-xl border ${colorMap[item.color]} transition-colors`}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">{item.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
