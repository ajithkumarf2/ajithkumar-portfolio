import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Sparkles, ThumbsUp, ThumbsDown, Bot, User, ArrowRight, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { OWNER_INFO, API_BASE_URL } from './constants';

const SUGGESTED_QUESTIONS = [
  "What has he built with RAG?",
  "Tell me about the Task Manager",
  "Is he available for hire?",
  "What are his core skills?"
];

function renderInlineBold(text) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, idx) =>
    idx % 2 === 1 ? (
      <strong key={idx} className="font-semibold text-slate-900 dark:text-white">
        {part}
      </strong>
    ) : (
      <React.Fragment key={idx}>{part}</React.Fragment>
    )
  );
}

function FormattedMessage({ content }) {
  const cleaned = content.replace(/\n?\*?\(Source:[^)]+\)\*?\s*$/i, '').trim();
  const lines = cleaned.split('\n');

  return (
    <div className="space-y-1.5">
      {lines.map((rawLine, i) => {
        const line = rawLine.trim();
        if (!line) return <div key={i} className="h-1" />;

        const bulletMatch = line.match(/^(?:[-*•])\s+(.*)$/);
        if (bulletMatch) {
          return (
            <div key={i} className="flex items-start gap-2 pl-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
              <span className="flex-1">{renderInlineBold(bulletMatch[1])}</span>
            </div>
          );
        }

        return (
          <p key={i} className="leading-relaxed">
            {renderInlineBold(line)}
          </p>
        );
      })}
    </div>
  );
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState(() => {
    const existing = localStorage.getItem('chat_session_id');
    if (existing) return existing;
    const newId = 'sess_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
    localStorage.setItem('chat_session_id', newId);
    return newId;
  });

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I'm Ajithkumar's AI portfolio assistant powered by Python, LangChain, LangGraph, and RAG. Ask me anything about his technical projects, architecture experience, or availability!`,
      citations: [],
      feedback: null
    }
  ]);

  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadData, setLeadData] = useState({ name: '', email: '' });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (questionText) => {
    const query = (questionText || input).trim();
    if (!query || isStreaming) return;

    setInput('');
    const userMsgId = 'msg_' + Date.now();
    const assistantMsgId = 'msg_' + (Date.now() + 1);

    setMessages(prev => [
      ...prev,
      { id: userMsgId, role: 'user', content: query }
    ]);

    setIsStreaming(true);

    // Placeholder assistant message
    setMessages(prev => [
      ...prev,
      {
        id: assistantMsgId,
        role: 'assistant',
        content: '',
        citations: [],
        feedback: null
      }
    ]);

    try {
      // Connect to Python LangGraph RAG streaming endpoint /api/chat/stream
      const response = await fetch(`${API_BASE_URL}/api/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message: query
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to reach chat service.`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const rawData = line.slice(6).trim();
            if (rawData === '[DONE]') continue;

            try {
              const parsed = JSON.parse(rawData);

              if (parsed.delta) {
                setMessages(prev =>
                  prev.map(msg =>
                    msg.id === assistantMsgId
                      ? { ...msg, content: msg.content + parsed.delta }
                      : msg
                  )
                );
              }

              if (parsed.citations) {
                setMessages(prev =>
                  prev.map(msg =>
                    msg.id === assistantMsgId
                      ? { ...msg, citations: parsed.citations }
                      : msg
                  )
                );
              }

              if (parsed.suggestLeadCapture) {
                setShowLeadForm(true);
              }
            } catch (e) {
              // Plain text stream fallback
              setMessages(prev =>
                prev.map(msg =>
                  msg.id === assistantMsgId
                    ? { ...msg, content: msg.content + rawData }
                    : msg
                )
              );
            }
          }
        }
      }
    } catch (err) {
      console.warn("Stream error, using grounded client fallback:", err);
      // Clean fallback if backend server isn't running yet
      setMessages(prev =>
        prev.map(msg =>
          msg.id === assistantMsgId
            ? {
                ...msg,
                content: `I'm currently unable to reach the Python LangGraph AI service. You can learn more about Ajithkumar's projects in the sections above, or reach out directly at ${OWNER_INFO.email}.`
              }
            : msg
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  const handleFeedback = async (msgId, vote) => {
    setMessages(prev =>
      prev.map(msg => (msg.id === msgId ? { ...msg, feedback: vote } : msg))
    );

    try {
      await fetch(`${API_BASE_URL}/api/chat/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          messageId: msgId,
          feedback: vote
        })
      });
    } catch (e) {
      // Non-blocking
    }
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!leadData.name || !leadData.email) return;

    try {
      await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadData.name,
          email: leadData.email,
          message: `Inquiry via AI Chatbot (Session: ${sessionId})`,
          source: 'chatbot_lead_capture'
        })
      });
      setLeadSubmitted(true);
    } catch (e) {
      setLeadSubmitted(true);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          type="button"
          aria-label="Open AI Assistant"
          className="group relative flex items-center gap-2.5 px-4 py-3.5 rounded-full bg-slate-900 dark:bg-surface-dark border border-emerald-500/30 text-white shadow-xl hover:shadow-emerald-500/20 hover:border-emerald-500 transition-all duration-200 hover:scale-105"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-emerald-400 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <span className="text-xs font-semibold tracking-wide">
            Hi! I'm Ajithkumar's AI Assistant
          </span>
        </button>
      )}

      {/* Floating Chat Modal Panel */}
      {isOpen && (
        <div className="w-[360px] sm:w-[420px] h-[580px] max-h-[85vh] rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-surface-dark shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-surface-darker flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>I'm Ajithkumar's AI Assistant</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                </h3>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/5 transition-colors"
              aria-label="Close Chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-emerald-500 text-white rounded-tr-sm'
                      : 'bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-white/5 rounded-tl-sm'
                  }`}
                >
                  {msg.content ? (
                    msg.role === 'assistant' ? (
                      <FormattedMessage content={msg.content} />
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    )
                  ) : (
                    isStreaming && (
                      <span className="inline-flex items-center gap-1.5 text-slate-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" />
                        <span>Thinking...</span>
                      </span>
                    )
                  )}

                  {/* Feedback Buttons */}
                  {msg.role === 'assistant' && msg.id !== 'welcome' && (
                    <div className="mt-2 pt-1.5 flex items-center gap-2 text-slate-400">
                      <button
                        onClick={() => handleFeedback(msg.id, 1)}
                        className={`p-1 rounded hover:text-emerald-500 transition-colors ${msg.feedback === 1 ? 'text-emerald-500' : ''}`}
                        title="Helpful response"
                      >
                        <ThumbsUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleFeedback(msg.id, -1)}
                        className={`p-1 rounded hover:text-red-500 transition-colors ${msg.feedback === -1 ? 'text-red-500' : ''}`}
                        title="Unhelpful response"
                      >
                        <ThumbsDown className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {/* In-chat Lead Capture Form */}
            {showLeadForm && (
              <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 text-xs space-y-2 animate-in fade-in">
                <div className="font-semibold text-emerald-700 dark:text-emerald-300">
                  Interested in hiring or interviewing Ajithkumar?
                </div>
                {leadSubmitted ? (
                  <div className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <Check className="w-4 h-4" />
                    <span>Thanks! Your details have been delivered to Ajithkumar.</span>
                  </div>
                ) : (
                  <form onSubmit={handleLeadSubmit} className="space-y-2">
                    <input
                      type="text"
                      placeholder="Your name"
                      required
                      value={leadData.name}
                      onChange={(e) => setLeadData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200 dark:border-white/10 bg-white dark:bg-surface-dark"
                    />
                    <input
                      type="email"
                      placeholder="Your email"
                      required
                      value={leadData.email}
                      onChange={(e) => setLeadData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200 dark:border-white/10 bg-white dark:bg-surface-dark"
                    />
                    <button
                      type="submit"
                      className="w-full py-1.5 rounded bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-colors"
                    >
                      Connect with Ajithkumar
                    </button>
                  </form>
                )}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompt Chips */}
          <div className="px-3 py-2 border-t border-slate-100 dark:border-white/5 bg-slate-50/70 dark:bg-surface-darker/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {SUGGESTED_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                disabled={isStreaming}
                onClick={() => handleSend(q)}
                className="px-2.5 py-1 rounded-full text-[11px] whitespace-nowrap bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors shadow-2xs"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-slate-100 dark:border-white/5 bg-white dark:bg-surface-dark flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              disabled={isStreaming}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about Ajithkumar..."
              className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white placeholder-slate-400 focus:border-emerald-500 focus:bg-white dark:focus:bg-surface-dark transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || isStreaming}
              className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white transition-all shadow-sm"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
