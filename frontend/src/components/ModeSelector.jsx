import { motion } from 'framer-motion'

const MODE_OPTIONS = [
  { id: 'normal', label: '💬 Normal', description: 'Full roadmaps' },
  { id: 'hackathon', label: '⚡ Hackathon', description: 'MVP in 24h' },
  { id: 'beginner', label: '🎓 Beginner', description: 'Step-by-step' },
  { id: 'stack', label: '🛠 Stack', description: 'Tech decisions' },
]

export default function ModeSelector({ mode, onModeChange }) {
  return (
    <div className="flex items-center gap-1.5 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
      {MODE_OPTIONS.map((m) => (
        <motion.button
          key={m.id}
          onClick={() => onModeChange(m.id)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
          style={{
            color: mode === m.id ? '#fff' : 'var(--text-muted)',
          }}
        >
          {mode === m.id && (
            <motion.div
              layoutId="mode-indicator"
              className="absolute inset-0 rounded-lg"
              style={{ background: 'linear-gradient(135deg, #4f9eff22, #a78bfa22)', border: '1px solid rgba(79,158,255,0.3)' }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">{m.label}</span>
        </motion.button>
      ))}
    </div>
  )
}
