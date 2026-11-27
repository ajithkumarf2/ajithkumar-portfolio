import React from 'react';
import { Calendar, MapPin, CheckCircle2, TrendingDown, Shield, Database, Briefcase } from 'lucide-react';
import { EXPERIENCES } from './constants';

export default function Experience() {
  return (
    <section id="experience" className="py-24 md:py-32 relative">
      <div className="w-full px-5 sm:px-8 lg:px-14 xl:px-20">
        {/* Header */}
        <div className="mb-14">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-4">
            <div className="w-8 h-[1.5px] bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" />
            03 &mdash; Professional Experience
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            Real-world impact.
          </h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400 text-base max-w-lg">
            Product engineering, backend optimization, and full-stack delivery in production environments.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-gradient-to-b from-emerald-500/60 via-teal-500/40 to-transparent hidden sm:block" />

          <div className="space-y-8">
            {EXPERIENCES.map((exp, index) => (
              <div key={index} className="relative sm:pl-20">
                {/* Timeline dot */}
                <div className="absolute left-0 top-7 w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30 items-center justify-center hidden sm:flex">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>

                <div className="group p-7 sm:p-9 rounded-3xl border border-slate-200/80 dark:border-white/8 bg-white dark:bg-slate-800/60 hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/5 hover:-translate-y-1 transition-all duration-300">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 mb-6 border-b border-slate-100 dark:border-white/5">
                    <div>
                      <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black font-mono bg-gradient-to-r from-emerald-500/15 to-teal-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 mb-3 uppercase tracking-wider">
                        {exp.type}
                      </span>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">{exp.role}</h3>
                      <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-1">{exp.company}</div>
                    </div>
                    <div className="flex flex-row sm:flex-col gap-3 sm:items-end text-xs font-mono text-slate-500 dark:text-slate-400 flex-shrink-0">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                        <Calendar className="w-3.5 h-3.5 text-emerald-500" /> {exp.period}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                        <MapPin className="w-3.5 h-3.5 text-emerald-500" /> {exp.location}
                      </span>
                    </div>
                  </div>

                  {/* Bullets */}
                  <ul className="space-y-3.5 mb-7">
                    {exp.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-500 flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3" />
                        </div>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Metrics */}
                  <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-slate-100 dark:border-white/5">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mr-1">Impact:</span>
                    {[
                      { icon: <TrendingDown className="w-3 h-3" />, text: '~20% API latency', color: 'emerald' },
                      { icon: <Shield className="w-3 h-3" />, text: 'Clerk Auth & RBAC', color: 'blue' },
                      { icon: <Database className="w-3 h-3" />, text: '100+ Book Records', color: 'teal' },
                    ].map((tag, i) => {
                      const cls = {
                        emerald: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/20',
                        blue: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/20',
                        teal: 'bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-500/20',
                      }[tag.color];
                      return (
                        <span key={i} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold font-mono border ${cls}`}>
                          {tag.icon} {tag.text}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
