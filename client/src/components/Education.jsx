import React from 'react';
import { GraduationCap, Award, CheckCircle2 } from 'lucide-react';
import { EDUCATION, CERTIFICATIONS } from './constants';

export default function Education() {
  return (
    <section id="education" className="py-24 md:py-32 bg-slate-50/60 dark:bg-slate-900/40 relative">
      <div className="w-full px-5 sm:px-8 lg:px-14 xl:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Education Column */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-4">
                <div className="w-8 h-[1.5px] bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" />
                05 &mdash; Academic Foundation
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                Education
              </h2>
            </div>

            <div className="space-y-5">
              {EDUCATION.map((edu, idx) => (
                <div
                  key={idx}
                  className="group p-7 rounded-3xl border border-slate-200/80 dark:border-white/8 bg-white dark:bg-slate-800/60 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          <GraduationCap className="w-4 h-4" />
                        </div>
                        <h3 className="font-black text-base text-slate-900 dark:text-white leading-tight">
                          {edu.degree}
                        </h3>
                      </div>
                      <p className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold pl-11">
                        {edu.institution}
                      </p>
                    </div>

                    <span className="px-3 py-1 rounded-xl text-xs font-mono bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 whitespace-nowrap self-start">
                      {edu.period}
                    </span>
                  </div>

                  <div className="mt-5 pt-5 border-t border-slate-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <span className="font-mono text-slate-700 dark:text-slate-300 font-bold">
                      Performance: <span className="text-emerald-600 dark:text-emerald-400">{edu.grade}</span>
                    </span>
                    {edu.coursework && (
                      <span className="text-slate-500 dark:text-slate-400">
                        Coursework: <span className="font-mono text-slate-600 dark:text-slate-300">{edu.coursework}</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications Column */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-4">
                <div className="w-8 h-[1.5px] bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" />
                Verified Credentials
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                Certifications
              </h2>
            </div>

            <div className="space-y-4">
              {CERTIFICATIONS.map((cert, idx) => (
                <div
                  key={idx}
                  className="group p-6 rounded-2xl border border-slate-200/80 dark:border-white/8 bg-white dark:bg-slate-800/60 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5 hover:-translate-y-0.5 transition-all duration-300 flex items-start gap-4"
                >
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                      {cert.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Issuer: <span className="font-semibold text-slate-700 dark:text-slate-300">{cert.issuer}</span>
                    </p>
                    <div className="pt-1">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{cert.badge}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
