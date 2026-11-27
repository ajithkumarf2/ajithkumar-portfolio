import React from 'react';
import { Github, Linkedin, Instagram, Mail, Phone, MapPin, ArrowUp } from 'lucide-react';
import { OWNER_INFO } from './constants';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-200/80 dark:border-white/8 bg-slate-50/80 dark:bg-[#080B12] pt-16 pb-10 transition-colors">
      <div className="w-full px-5 sm:px-8 lg:px-14 xl:px-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand & Summary */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center font-black text-white text-sm shadow-md shadow-emerald-500/25">
                AE
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white">
                  {OWNER_INFO.name}
                </div>
                <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                  Full-Stack &amp; AI Developer
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              Full-stack developer building scalable web applications and intelligent AI agent workflows with modern engineering rigor.
            </p>
            <div className="inline-flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono px-3 py-1.5 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <MapPin className="w-3.5 h-3.5 text-emerald-500" />
              <span>{OWNER_INFO.location}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-4 font-mono">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              <li><a href="#about" className="hover:text-emerald-500 transition-colors">About</a></li>
              <li><a href="#skills" className="hover:text-emerald-500 transition-colors">Skills &amp; Stack</a></li>
              <li><a href="#experience" className="hover:text-emerald-500 transition-colors">Experience</a></li>
              <li><a href="#projects" className="hover:text-emerald-500 transition-colors">Featured Projects</a></li>
              <li><a href="#education" className="hover:text-emerald-500 transition-colors">Education &amp; Certs</a></li>
              <li><a href="#contact" className="hover:text-emerald-500 transition-colors">Get in Touch</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-4 font-mono">
              Connect
            </h3>
            <div className="flex flex-col space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <a
                href={OWNER_INFO.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 hover:text-emerald-500 transition-colors"
              >
                <Github className="w-4 h-4 text-emerald-500" />
                <span>GitHub</span>
              </a>
              <a
                href={OWNER_INFO.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 hover:text-emerald-500 transition-colors"
              >
                <Linkedin className="w-4 h-4 text-emerald-500" />
                <span>LinkedIn</span>
              </a>
              <a
                href={OWNER_INFO.instagram}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 hover:text-emerald-500 transition-colors"
              >
                <Instagram className="w-4 h-4 text-emerald-500" />
                <span>Instagram</span>
              </a>
              <a
                href={`mailto:${OWNER_INFO.email}`}
                className="flex items-center gap-2.5 hover:text-emerald-500 transition-colors"
              >
                <Mail className="w-4 h-4 text-emerald-500" />
                <span className="truncate">{OWNER_INFO.email}</span>
              </a>
              <a
                href={`tel:${OWNER_INFO.phoneRaw}`}
                className="flex items-center gap-2.5 hover:text-emerald-500 transition-colors"
              >
                <Phone className="w-4 h-4 text-emerald-500" />
                <span>{OWNER_INFO.phone}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-200/80 dark:border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-500">
          <div>
            © {new Date().getFullYear()} {OWNER_INFO.name}. Built with React, Tailwind CSS, Express, Python &amp; LangGraph.
          </div>
          <button
            onClick={scrollToTop}
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-emerald-500/40 hover:text-emerald-500 transition-all focus:outline-none"
            aria-label="Back to top"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
