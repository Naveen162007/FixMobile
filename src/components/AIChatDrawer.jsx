import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, User, MapPin, Clock, ShieldCheck } from 'lucide-react';
import { fetchApi } from '../utils/api';

export default function AIChatDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: '👋 Vanakkam! I am Kovai Mobile Care\'s AI Assistant. How can I help you today with mobile repairs in Coimbatore?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    try {
      const data = await fetchApi('/ai/assistant-chat', {
        method: 'POST',
        body: JSON.stringify({ message: userText })
      });

      setMessages(prev => [...prev, { sender: 'ai', text: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: 'Sorry, I am having trouble connecting to our database right now. Please call our Gandhipuram store directly at +91 98765 43210.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const sendQuickPrompt = (promptText) => {
    setInput(promptText);
    setTimeout(() => {
      const formEvent = { preventDefault: () => {} };
      handleSend(formEvent);
    }, 50);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      
      {/* Floating Toggle Icon */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group p-4 rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 text-white shadow-2xl shadow-blue-600/50 hover:scale-110 transition-transform flex items-center justify-center glow-blue"
        >
          <Bot className="w-7 h-7 animate-bounce" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full border-2 border-navy-900 animate-pulse"></span>
        </button>
      )}

      {/* Chat Window Drawer */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[540px] bg-navy-900 border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
          
          {/* Header */}
          <div className="p-4 bg-navy-800 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 p-0.5 shadow-md">
                <div className="w-full h-full bg-navy-900 rounded-[10px] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-cyanAccent" />
                </div>
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                  Kovai AI Assistant <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </h3>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> Real-Time Shop DB Connected
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full bg-navy-900 hover:bg-navy-700 text-slate-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-lg bg-blue-600/30 text-cyanAccent flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] p-3 rounded-2xl font-normal leading-relaxed whitespace-pre-wrap ${
                    m.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none shadow-md'
                      : 'bg-navy-800 text-slate-200 border border-white/10 rounded-tl-none shadow-sm'
                  }`}
                >
                  {m.text}
                </div>

                {m.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-navy-700 text-slate-300 flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 text-xs text-slate-400 items-center">
                <Bot className="w-4 h-4 text-cyanAccent animate-spin" />
                <span>Querying Coimbatore DB...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 py-2 bg-navy-950/60 border-t border-white/5 flex gap-1.5 overflow-x-auto text-[11px] scrollbar-none">
            <button
              onClick={() => sendQuickPrompt('What are repair prices?')}
              className="px-2.5 py-1 rounded-full bg-navy-800 hover:bg-blue-600/30 text-slate-300 border border-white/10 flex-shrink-0"
            >
              💰 Repair Prices
            </button>
            <button
              onClick={() => sendQuickPrompt('Is doorstep service available in Coimbatore?')}
              className="px-2.5 py-1 rounded-full bg-navy-800 hover:bg-blue-600/30 text-slate-300 border border-white/10 flex-shrink-0"
            >
              📍 Doorstep Coverage
            </button>
            <button
              onClick={() => sendQuickPrompt('What is the 10% first booking discount?')}
              className="px-2.5 py-1 rounded-full bg-navy-800 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 flex-shrink-0"
            >
              🎉 10% Offer
            </button>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-navy-800 border-t border-white/10 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask prices, doorstep area, status..."
              className="flex-1 bg-navy-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:border-cyanAccent outline-none"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs disabled:opacity-50 transition-all flex items-center justify-center shadow-md shadow-blue-900/40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
}
