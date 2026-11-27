import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { OWNER_INFO } from './constants';

export default function Navbar({ theme, toggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Education', href: '#education' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'bg-white/90 dark:bg-[#0B0F17]/90 backdrop-blur-xl border-b border-slate-200/60 dark:border-white/8 shadow-sm shadow-slate-200/50 dark:shadow-black/20 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="w-full px-5 sm:px-8 lg:px-14 xl:px-20 flex items-center justify-between">
        {/* Brand */}
        <a
          href="#"
          className="flex items-center gap-3 group focus:outline-none"
          aria-label="Ajithkumar E – Home"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center font-black text-white text-sm shadow-lg shadow-emerald-500/30 group-hover:shadow-emerald-500/50 group-hover:scale-105 transition-all">
            AE
            <div className="absolute inset-0 rounded-xl ring-2 ring-emerald-500/20 group-hover:ring-emerald-500/40 transition-all" />
          </div>
          <div>
            <div className="font-bold text-sm text-slate-900 dark:text-white tracking-tight leading-tight">
              {OWNER_INFO.name}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Available for roles</span>
            </div>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="relative px-3.5 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/8 dark:hover:bg-emerald-500/10 transition-all"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          <a
            href="#contact"
            className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-md shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all hover:-translate-y-0.5"
          >
            Let's Talk <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            aria-label="Toggle menu"
            className="p-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-white/8 bg-white/95 dark:bg-[#0B0F17]/95 backdrop-blur-xl px-4 py-5 space-y-1 shadow-2xl">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl text-slate-700 dark:text-slate-200 hover:bg-emerald-500/8 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              {link.name}
              <ArrowUpRight className="w-3.5 h-3.5 opacity-40" />
            </a>
          ))}
          <div className="pt-3 border-t border-slate-100 dark:border-white/5">
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2 text-sm font-bold px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md"
            >
              Let's Talk <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
