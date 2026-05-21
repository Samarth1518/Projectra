import { useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import MessageBubble, { TypingIndicator } from './MessageBubble'
import ChatInput from './ChatInput'
import { Sparkles, MessageSquare, Zap, GraduationCap, Layers } from 'lucide-react'

const MODE_META = {
  normal: { label: 'Normal Mode', icon: MessageSquare, color: '#4f9eff', badge: '💬' },
  hackathon: { label: 'Hackathon Mode', icon: Zap, color: '#facc15', badge: '⚡' },
  beginner: { label: 'Beginner Mode', icon: GraduationCap, color: '#34d399', badge: '🎓' },
  stack: { label: 'Stack Advisor', icon: Layers, color: '#a78bfa', badge: '🛠' },
}

const SUGGESTIONS = [
  'Build me a Netflix clone',
  'Hackathon idea for 24 hours',
  'Best stack for beginners',
  'How do I deploy a React app?',
]

function EmptyState({ mode, onSuggestion }) {
  const meta = MODE_META[mode] || MODE_META.normal

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
        style={{
          background: `${meta.color}15`,
          border: `1px solid ${meta.color}30`,
          boxShadow: `0 0 40px ${meta.color}20`,
        }}
      >
        <span className="text-4xl">{meta.badge}</span>
      </motion.div>

      <motion.h2
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-xl font-bold mb-2"
        style={{ color: 'var(--text-primary)' }}
      >
        Ask me anything about your project
      </motion.h2>
      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="text-sm mb-8 max-w-sm"
        style={{ color: 'var(--text-secondary)' }}
      >
        Currently in <span style={{ color: meta.color }} className="font-semibold">{meta.label}</span>.
        I can help you plan, build, and deploy your next project.
      </motion.p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-lg">
        {SUGGESTIONS.map((s, i) => (
          <motion.button
            key={s}
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.07 }}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSuggestion(s)}
            className="px-4 py-3 rounded-xl text-sm text-left transition-all duration-200"
            style={{
              background: 'rgba(18,18,28,0.8)',
              border: '1px solid rgba(255,255,255,0.07)',
              color: 'var(--text-secondary)',
            }}
          >
            <span className="text-neon-blue mr-2">→</span>
            {s}
          </motion.button>
        ))}
      </div>
    </div>
  )
}

export default function ChatWindow({ messages, mode, isLoading, onSend }) {
  const scrollRef = useRef(null)
  const meta = MODE_META[mode] || MODE_META.normal

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  return (
    <div className="flex flex-col flex-1 overflow-hidden" style={{ background: '#050508' }}>
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-5 py-3.5 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(5,5,8,0.95)' }}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">{meta.badge}</span>
            <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
              {meta.label}
            </span>
          </div>
          <span
            className="px-2.5 py-0.5 rounded-full text-xs font-medium"
            style={{ background: `${meta.color}15`, color: meta.color, border: `1px solid ${meta.color}30` }}
          >
            Active
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles size={14} style={{ color: 'var(--text-muted)' }} />
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Gemini-powered
          </span>
        </div>
      </div>

      {/* Messages area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 pt-4"
        style={{ overflowAnchor: 'none' }}
      >
        {messages.length === 0 ? (
          <EmptyState mode={mode} onSuggestion={onSend} />
        ) : (
          <div className="max-w-3xl mx-auto">
            {messages.map((msg, i) => (
              <MessageBubble key={msg.id || i} message={msg} index={i} />
            ))}
            <AnimatePresence>
              {isLoading && <TypingIndicator />}
            </AnimatePresence>
            <div style={{ height: '8px' }} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex-shrink-0 max-w-3xl mx-auto w-full">
        <ChatInput onSend={onSend} isLoading={isLoading} />
      </div>
    </div>
  )
}
