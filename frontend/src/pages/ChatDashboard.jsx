import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, ArrowLeft, Send, Sparkles, Zap, Brain, Layers, GraduationCap, MessageSquarePlus } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import MessageBubble from '../components/MessageBubble';

const MODES = [
  { id: 'normal', title: 'Normal Mode', icon: Brain, subtitle: 'Standard AI assistant', color: 'text-blue-400' },
  { id: 'hackathon', title: 'Hackathon', icon: Zap, subtitle: 'Fast MVP builder', color: 'text-yellow-400' },
  { id: 'beginner', title: 'Beginner', icon: GraduationCap, subtitle: 'Step-by-step help', color: 'text-green-400' },
  { id: 'stack', title: 'Stack Advisor', icon: Layers, subtitle: 'Tech stack choices', color: 'text-purple-400' }
];

const SUGGESTIONS = [
  "Build me a Netflix clone",
  "Best stack for a portfolio?",
  "I have 12 hours. MVP ideas?",
  "Explain React hooks to a beginner"
];

export default function ChatDashboard() {
  const navigate = useNavigate();
  const { messages, mode, isLoading, sendMessage, clearChat, setMode } = useChat();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputText.trim() || isLoading) return;
    sendMessage(inputText);
    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e) => {
    setInputText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px';
  };

  const activeModeDetails = MODES.find(m => m.id === mode);
  const ActiveIcon = activeModeDetails?.icon || Brain;

  return (
    <div className="flex h-screen w-full bg-[#050508] text-white overflow-hidden font-sans">
      
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:static top-0 left-0 h-full w-[260px] bg-[#0d0d14] border-r border-white/5 z-50 transform transition-transform duration-300 flex flex-col ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="font-bold text-xl gradient-text tracking-tight">Projectra AI</div>
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
          </div>
          <button className="lg:hidden text-gray-400 hover:text-white" onClick={() => setMobileOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 mt-2 px-2">AI Modes</div>
          {MODES.map((m) => {
            const Icon = m.icon;
            const isActive = mode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => { setMode(m.id); setMobileOpen(false); }}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left ${isActive ? 'bg-blue-500/15 border border-blue-500/30 neon-glow' : 'hover:bg-white/5 border border-transparent'}`}
              >
                <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-500/20' : 'bg-white/5'}`}>
                  <Icon size={18} className={isActive ? 'text-blue-400' : 'text-gray-400'} />
                </div>
                <div>
                  <div className={`font-semibold text-sm ${isActive ? 'text-blue-100' : 'text-gray-200'}`}>{m.title}</div>
                  <div className="text-xs text-gray-500">{m.subtitle}</div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={() => { clearChat(); setMobileOpen(false); }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors border border-white/10"
          >
            <MessageSquarePlus size={16} />
            New Chat
          </button>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col h-full bg-[#050508] relative">
        {/* Topbar */}
        <div className="h-16 flex items-center justify-between px-4 lg:px-6 border-b border-white/5 glass z-10 sticky top-0">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-gray-400 hover:text-white p-2 -ml-2" onClick={() => setMobileOpen(true)}>
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
              <ActiveIcon size={18} className={activeModeDetails?.color} />
              <span className="font-semibold text-sm text-gray-200">{activeModeDetails?.title}</span>
              <span className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] font-medium text-gray-400 border border-white/10">Active</span>
            </div>
          </div>
          <button onClick={() => navigate('/')} className="hidden lg:flex items-center gap-1.5 text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
            <ArrowLeft size={14} /> Home
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth">
          <div className="max-w-3xl mx-auto flex flex-col gap-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center mt-20 lg:mt-32">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 neon-glow">
                  <Sparkles size={32} className="text-blue-400" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">Ask me anything about your project</h2>
                <p className="text-gray-400 mb-10 max-w-md">I can help you build roadmaps, choose your tech stack, or create a hackathon MVP.</p>
                
                <div className="flex flex-wrap justify-center gap-3 max-w-2xl">
                  {SUGGESTIONS.map((s, i) => (
                    <button 
                      key={i}
                      onClick={() => { setInputText(s); }}
                      className="px-4 py-2.5 glass rounded-full text-sm text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={msg.id || i}>
                  <MessageBubble message={msg} />
                </div>
              ))
            )}
            
            {isLoading && (
              <div className="flex items-center gap-3 text-gray-400 text-sm py-4">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                Projectra AI is thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 lg:p-6 bg-gradient-to-t from-[#050508] to-transparent">
          <div className="max-w-3xl mx-auto relative">
            <form onSubmit={handleSend} className="glass rounded-2xl p-2 flex items-end gap-2 border border-white/10 focus-within:border-blue-500/50 focus-within:shadow-[0_0_15px_rgba(79,158,255,0.15)] transition-all">
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder="Type your message here..."
                className="w-full max-h-[150px] bg-transparent text-white placeholder-gray-500 px-3 py-3 outline-none resize-none overflow-y-auto text-sm"
                rows="1"
              />
              <button 
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="p-3 mb-1 mr-1 rounded-xl bg-blue-500 text-white disabled:bg-white/5 disabled:text-gray-500 hover:bg-blue-400 transition-colors flex-shrink-0"
              >
                <Send size={18} />
              </button>
            </form>
            <div className="text-center mt-3 text-[10px] text-gray-500">
              AI can make mistakes. Consider verifying important information.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
