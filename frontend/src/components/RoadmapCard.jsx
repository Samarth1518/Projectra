import { motion } from 'framer-motion'

export default function RoadmapCard({ phase, title, description, duration, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex gap-4 p-4 rounded-xl"
      style={{ background: 'rgba(18,18,28,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex flex-col items-center">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #4f9eff, #a78bfa)', color: '#fff' }}
        >
          {phase}
        </div>
        {index < 3 && <div className="w-px flex-1 mt-2" style={{ background: 'rgba(79,158,255,0.2)' }} />}
      </div>
      <div className="flex-1 pb-4">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{title}</h4>
          {duration && (
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(79,158,255,0.1)', color: '#4f9eff' }}>
              {duration}
            </span>
          )}
        </div>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{description}</p>
      </div>
    </motion.div>
  )
}
