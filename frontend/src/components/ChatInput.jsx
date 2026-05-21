import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Square } from 'lucide-react'

const PLACEHOLDERS = [
  'Describe your project idea...',
  'Ask for a tech stack recommendation...',
  'Need a hackathon MVP plan?',
  'How do I deploy a React app?',
  'Build me a project roadmap...',
]

export default function ChatInput({ onSend, isLoading, disabled }) {
  const [value, setValue] = useState('')
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const textareaRef = useRef(null)

  // Cycle placeholder text
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % PLACEHOLDERS.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    const maxHeight = 120
    ta.style.height = Math.min(ta.scrollHeight, maxHeight) + 'px'
  }, [value])

  const handleSend = () => {
    const text = value.trim()
    if (!text || isLoading || disabled) return
    onSend(text)
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div
      className="px-4 pb-4 pt-3"
      style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: '#050508' }}
    >
      <div
        className="flex items-end gap-3 px-4 py-3 rounded-2xl transition-all duration-200"
        style={{
          background: 'rgba(18,18,28,0.9)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: value ? '0 0 0 2px rgba(79,158,255,0.2)' : 'none',
        }}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={PLACEHOLDERS[placeholderIndex]}
          disabled={isLoading || disabled}
          rows={1}
          className="flex-1 bg-transparent resize-none outline-none text-sm leading-relaxed"
          style={{
            color: 'var(--text-primary)',
            caretColor: '#4f9eff',
            maxHeight: '120px',
            overflowY: 'auto',
          }}
        />

        <motion.button
          onClick={handleSend}
          disabled={!value.trim() || isLoading || disabled}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
          style={{
            background: value.trim() && !isLoading
              ? 'linear-gradient(135deg, #4f9eff, #a78bfa)'
              : 'rgba(255,255,255,0.05)',
            boxShadow: value.trim() && !isLoading ? '0 0 15px rgba(79,158,255,0.4)' : 'none',
            cursor: !value.trim() || isLoading ? 'not-allowed' : 'pointer',
          }}
        >
          {isLoading ? (
            <Square size={14} className="text-white/40" />
          ) : (
            <Send size={14} style={{ color: value.trim() ? '#fff' : 'var(--text-muted)' }} />
          )}
        </motion.button>
      </div>

      <p className="text-center text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
        Press <kbd className="px-1 py-0.5 rounded text-xs" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>Enter</kbd> to send · <kbd className="px-1 py-0.5 rounded text-xs" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>Shift+Enter</kbd> for newline
      </p>
    </div>
  )
}
