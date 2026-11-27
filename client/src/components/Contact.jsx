import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Linkedin, Github, Instagram, Loader2, ArrowRight } from 'lucide-react';
import { OWNER_INFO, API_BASE_URL } from './constants';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage('Please fill out all fields before submitting.');
      setStatus('error');
      return;
    }
    setStatus('loading');
    setErrorMessage('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name.trim(), email: formData.email.trim(), message: formData.message.trim(), source: 'contact_form' })
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to submit.');
      }
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus('error');
      setErrorMessage(err.message || 'Network error. Email me directly at ' + OWNER_INFO.email);
    }
  };

  const contactItems = [
    { icon: <Mail className="w-5 h-5" />, label: 'Email', value: OWNER_INFO.email, href: `mailto:${OWNER_INFO.email}` },
    { icon: <Phone className="w-5 h-5" />, label: 'Phone / WhatsApp', value: OWNER_INFO.phone, href: `tel:${OWNER_INFO.phoneRaw}` },
    { icon: <MapPin className="w-5 h-5" />, label: 'Location', value: OWNER_INFO.location, href: null },
  ];

  return (
    <section id="contact" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/6 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full px-5 sm:px-8 lg:px-14 xl:px-20 relative">
        {/* Section header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-4">
            <div className="w-8 h-[1.5px] bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" />
            06 &mdash; Contact & Connect
            <div className="w-8 h-[1.5px] bg-gradient-to-l from-emerald-500 to-teal-400 rounded-full" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
            Let's work together.
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-base max-w-lg mx-auto">
            Looking for a full-stack engineer or AI developer? I'm open to opportunities, collaborations, and conversations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Info + Socials */}
          <div className="lg:col-span-5 space-y-5">
            {/* Contact cards */}
            {contactItems.map((item, i) => (
              item.href ? (
                <a
                  key={i}
                  href={item.href}
                  className="group flex items-center gap-4 p-5 rounded-2xl border border-slate-200 dark:border-white/8 bg-white dark:bg-slate-800/60 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/5 hover:-translate-y-0.5 transition-all"
                >
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">{item.label}</div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{item.value}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 ml-auto group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                </a>
              ) : (
                <div
                  key={i}
                  className="flex items-center gap-4 p-5 rounded-2xl border border-slate-200 dark:border-white/8 bg-white dark:bg-slate-800/60"
                >
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">{item.icon}</div>
                  <div>
                    <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">{item.label}</div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{item.value}</div>
                  </div>
                </div>
              )
            ))}

            {/* Social links */}
            <div className="flex gap-3 pt-2">
              <a
                href={OWNER_INFO.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800/60 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-emerald-500/40 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/5 transition-all"
              >
                <Linkedin className="w-4 h-4" /> LinkedIn
              </a>
              <a
                href={OWNER_INFO.github}
                target="_blank"
                rel="noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800/60 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-emerald-500/40 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/5 transition-all"
              >
                <Github className="w-4 h-4" /> GitHub
              </a>
              <a
                href={OWNER_INFO.instagram}
                target="_blank"
                rel="noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800/60 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-emerald-500/40 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/5 transition-all"
              >
                <Instagram className="w-4 h-4" /> Instagram
              </a>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-7">
            <div className="p-7 sm:p-9 rounded-3xl border border-slate-200/80 dark:border-white/8 bg-white dark:bg-slate-800/60 shadow-xl shadow-slate-200/40 dark:shadow-black/20">
              <div className="mb-7">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Send a Message</h3>
                <p className="text-xs text-slate-400 mt-1 font-mono">I typically reply within 24 hours.</p>
              </div>

              {status === 'success' ? (
                <div className="p-8 rounded-2xl bg-emerald-500/8 border border-emerald-500/20 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-black text-lg text-slate-900 dark:text-white">Message sent! 🎉</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                      Thanks for reaching out. I'll reply to your email soon.
                    </p>
                  </div>
                  <button
                    onClick={() => setStatus('idle')}
                    className="text-xs font-bold px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {status === 'error' && (
                    <div className="p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-xs text-red-600 dark:text-red-400 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2 font-mono tracking-wide uppercase">
                        Name *
                      </label>
                      <input
                        id="name" name="name" type="text" required
                        placeholder="Your name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2 font-mono tracking-wide uppercase">
                        Email *
                      </label>
                      <input
                        id="email" name="email" type="email" required
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2 font-mono tracking-wide uppercase">
                      Message *
                    </label>
                    <textarea
                      id="message" name="message" rows={5} required
                      placeholder="Tell me about your role, project, or idea..."
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-60 text-white font-black text-sm shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {status === 'loading' ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                    ) : (
                      <><Send className="w-4 h-4" /> Send Message</>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
