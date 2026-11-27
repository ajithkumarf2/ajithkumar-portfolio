import React, { useState } from 'react';
import { ArrowRight, Download, Mail, Github, Linkedin, Instagram, Terminal, MapPin, Code2, Cpu } from 'lucide-react';
import { OWNER_INFO } from './constants';

const TECH_BADGES = ['React.js', 'Node.js', 'LangChain', 'LangGraph', 'RAG', 'Gemini API'];

export default function Hero() {
  const [imgError, setImgError] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden">
      {/* Rich background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-emerald-500/8 dark:bg-emerald-500/12 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-500/6 dark:bg-teal-500/10 rounded-full blur-[120px]" />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(circle, #10B981 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }}
        />
      </div>

      <div className="w-full px-5 sm:px-8 lg:px-14 xl:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">

          {/* ── LEFT: Text Content ── */}
          <div className="lg:col-span-7 space-y-6 order-2 lg:order-1">

            {/* Status badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-emerald-500/25 bg-emerald-500/8 dark:bg-emerald-500/12 text-xs font-mono text-emerald-700 dark:text-emerald-300 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Open to Full-Stack &amp; AI Engineer Roles
            </div>

            {/* Name + Role */}
            <div>
              <p className="text-sm font-mono text-slate-500 dark:text-slate-400 mb-2 tracking-widest uppercase">
                Hello, I'm
              </p>
              <h1 className="text-5xl sm:text-6xl xl:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.05] mb-4">
                <span className="bg-gradient-to-br from-emerald-500 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                  Ajithkumar
                </span>{' '}
                <span className="text-slate-800 dark:text-slate-100">E</span>
              </h1>
              <div className="flex items-center gap-3">
                <div className="h-[2px] w-10 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" />
                <p className="text-lg sm:text-xl font-semibold text-slate-600 dark:text-slate-300">
                  Full-Stack &amp; AI Developer
                </p>
              </div>
            </div>

            {/* Pitch */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
              I build production-grade web applications and intelligent AI agent workflows — combining React, Node.js, LangGraph, RAG, and the Gemini API into systems that actually ship.
            </p>

            {/* Meta pills */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <MapPin className="w-3.5 h-3.5 text-emerald-500" /> {OWNER_INFO.location}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <Terminal className="w-3.5 h-3.5 text-emerald-500" /> B.E. CSE 2021–2025
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <Cpu className="w-3.5 h-3.5 text-emerald-500" /> AI · Full-Stack
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                View Projects <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href={OWNER_INFO.resumeUrl}
                download="Ajithkumar_E_Resume.pdf"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-200 dark:border-white/15 bg-white dark:bg-transparent hover:border-emerald-500/50 dark:hover:border-emerald-500/50 text-slate-800 dark:text-slate-200 font-semibold text-sm transition-all hover:-translate-y-0.5"
              >
                <Download className="w-4 h-4 text-emerald-500" /> Resume
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold text-sm transition-colors"
              >
                <Mail className="w-4 h-4" /> Contact
              </a>
            </div>

            {/* Social Row */}
            <div className="flex items-center gap-4 pt-1">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">Find me</span>
              <div className="flex gap-2">
                {[
                  { href: OWNER_INFO.github, label: 'GitHub', icon: <Github className="w-4 h-4" /> },
                  { href: OWNER_INFO.linkedin, label: 'LinkedIn', icon: <Linkedin className="w-4 h-4" /> },
                  { href: OWNER_INFO.instagram, label: 'Instagram', icon: <Instagram className="w-4 h-4" /> },
                  { href: `mailto:${OWNER_INFO.email}`, label: 'Email', icon: <Mail className="w-4 h-4" /> },
                ].map(s => (
                  <a
                    key={s.label}
                    href={s.href}
                    target={s.href.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer"
                    aria-label={s.label}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-emerald-500 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Profile Photo ── */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end order-1 lg:order-2">
            <div className="relative">
              {/* Glow ring behind photo */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-500/30 via-teal-400/20 to-cyan-500/20 blur-2xl scale-110" />

              {/* Photo card */}
              <div className="relative w-72 h-80 sm:w-80 sm:h-96 lg:w-96 lg:h-[440px] rounded-3xl overflow-hidden border-2 border-emerald-500/30 dark:border-emerald-500/20 shadow-2xl shadow-emerald-500/15 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                {!imgError ? (
                  <img
                    src="/ajith-photo.jpg"
                    alt="Ajithkumar E – Full-Stack & AI Developer"
                    className="w-full h-full object-cover object-top"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  /* Fallback avatar when image not found */
                  <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                    <div className="w-28 h-28 rounded-2xl bg-emerald-500/15 border-2 border-emerald-500/30 flex items-center justify-center">
                      <span className="text-5xl font-black text-emerald-600 dark:text-emerald-400 font-mono">AE</span>
                    </div>
                    <div className="text-center px-6">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Ajithkumar E</p>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-mono mt-1">Full-Stack · AI Dev</p>
                    </div>
                  </div>
                )}

                {/* Bottom overlay badge */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-mono text-white/90">Available for roles</span>
                  </div>
                </div>
              </div>

              {/* Floating tech badge cards */}
              <div className="absolute -left-8 top-8 hidden sm:block">
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3 shadow-xl shadow-slate-200/60 dark:shadow-black/40">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Full-Stack</span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">React · Node · Express</p>
                </div>
              </div>

              <div className="absolute -right-8 bottom-20 hidden sm:block">
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3 shadow-xl shadow-slate-200/60 dark:shadow-black/40">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-teal-500" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">AI Engineer</span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">LangGraph · RAG · Gemini</p>
                </div>
              </div>

              {/* Decorative corner accent */}
              <div className="absolute -bottom-3 -right-3 w-full h-full rounded-3xl border-2 border-emerald-500/15 -z-10" />
            </div>
          </div>
        </div>

        {/* Tech badges scrolling row */}
        <div className="mt-16 pt-8 border-t border-slate-200/60 dark:border-white/5">
          <p className="text-[11px] font-mono text-slate-400 uppercase tracking-widest mb-4">Core Technologies</p>
          <div className="flex flex-wrap gap-2">
            {TECH_BADGES.map(t => (
              <span key={t} className="px-3.5 py-1.5 rounded-lg text-xs font-mono bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-emerald-500/40 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
