import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import axios from 'axios';

const WELCOME = {
  role: 'assistant',
  content: 'Hello, operator. I\'m the TruthLens AI assistant. Ask me anything about deepfake detection, how to interpret scan results, or how to use the platform.',
};

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    const userMsg = { role: 'user', content: text };
    setMessages((m) => [...m, userMsg]);
    setLoading(true);
    try {
      const history = [...messages, userMsg].map(({ role, content }) => ({ role, content }));
      const { data } = await axios.post('/api/chat', { messages: history });
      setMessages((m) => [...m, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: 'Sorry, I\'m unable to respond right now. Please try again later.' }]);
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 w-13 h-13 rounded-2xl cyber-btn-cyan p-3.5 shadow-neon-cyan flex items-center justify-center"
        aria-label="Toggle AI assistant"
      >
        {open ? <X size={20} /> : <MessageCircle size={20} />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 glass-card rounded-2xl flex flex-col overflow-hidden shadow-neon-cyan border border-cyber-cyan/20"
          style={{ height: 440 }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-cyber-border bg-zinc-950/80">
            <div className="w-8 h-8 rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-center">
              <Bot size={15} className="text-cyber-cyan" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">TruthLens Assistant</p>
              <p className="text-[9px] text-cyber-emerald font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyber-emerald inline-block animate-pulse" />
                ONLINE
              </p>
            </div>
            <button onClick={() => setOpen(false)} className="ml-auto text-gray-600 hover:text-white transition">
              <X size={15} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-6 h-6 rounded-lg shrink-0 flex items-center justify-center ${
                  msg.role === 'user' ? 'bg-cyber-purple/20' : 'bg-cyber-cyan/10'
                }`}>
                  {msg.role === 'user'
                    ? <User size={11} className="text-cyber-purple" />
                    : <Bot size={11} className="text-cyber-cyan" />}
                </div>
                <div className={`max-w-[80%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-cyber-purple/20 text-white rounded-tr-none'
                    : 'bg-zinc-900 text-gray-200 rounded-tl-none border border-cyber-border'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-lg shrink-0 bg-cyber-cyan/10 flex items-center justify-center">
                  <Bot size={11} className="text-cyber-cyan" />
                </div>
                <div className="bg-zinc-900 border border-cyber-border px-3 py-2 rounded-xl rounded-tl-none flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-cyber-border flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder="Ask about deepfake detection..."
              rows={1}
              className="cyber-input flex-1 rounded-xl px-3 py-2 text-xs resize-none"
              style={{ minHeight: 36, maxHeight: 80 }}
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              className="cyber-btn-cyan rounded-xl px-3 disabled:opacity-40 shrink-0 flex items-center justify-center"
            >
              <Send size={13} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
