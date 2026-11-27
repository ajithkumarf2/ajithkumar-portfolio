import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Education from './components/Education';
import Contact from './components/Contact';
import ErrorBoundary from './components/ErrorBoundary';
import ChatWidget from './components/ChatWidget';
import { useTheme } from './components/useTheme';
import { API_BASE_URL } from './components/constants';

export default function App() {
  const { theme, toggleTheme } = useTheme();

  // Log initial page view for analytics
  useEffect(() => {
    try {
      fetch(`${API_BASE_URL}/api/analytics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'page_view',
          eventData: { path: window.location.pathname, referrer: document.referrer }
        })
      }).catch(() => {});
    } catch (e) {
      // Non-blocking analytics
    }
  }, []);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 font-sans selection:bg-emerald-500/20 selection:text-emerald-400">
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        <main id="main-content">
          <Hero />
          <About />
          <Skills />
          <Experience />
          <Projects />
          <Education />
          <Contact />
        </main>
        <Footer />
        <ChatWidget />
      </div>
    </ErrorBoundary>
  );
}
