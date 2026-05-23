import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { MessageSquare, Zap, GraduationCap, Layers, Plus, ChevronRight, Sparkles } from 'lucide-react'

const MODES = [
  {
    id: 'normal',
    label: 'Normal Mode',
    icon: MessageSquare,
    description: 'Full project roadmaps',
    color: 'blue',
  },
  {
    id: 'hackathon',
    label: 'Hackathon Mode',
    icon: Zap,
    description: 'MVP in 24-48 hours',
    color: 'yellow',
  },
  {
    id: 'beginner',
    label: 'Beginner Mode',
    icon: GraduationCap,
    description: 'Student-friendly guide',
    color: 'green',
  },
  {
    id: 'stack',
    label: 'Stack Advisor',
    icon: Layers,
    description: 'Tech stack decisions',
    color: 'purple',
  },
]

const COLOR_MAP = {
  blue: {
    active: 'bg-neon-blue/10 border-neon-blue/50 shadow-neon-glow-sm',
    icon: 'text-neon-blue',
    dot: 'bg-neon-blue',
  },
  yellow: {
    active: 'bg-yellow-400/10 border-yellow-400/50',
    icon: 'text-yellow-400',
    dot: 'bg-yellow-400',
  },
  green: {
    active: 'bg-emerald-400/10 border-emerald-400/50',
    icon: 'text-emerald-400',
    dot: 'bg-emerald-400',
  },
  purple: {
    active: 'bg-neon-purple/10 border-neon-purple/50 shadow-purple-glow',
    icon: 'text-neon-purple',
    dot: 'bg-neon-purple',
  },
}

export default function Sidebar({ mode, onModeChange, onNewChat, isMobileOpen, onMobileClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={`
          fixed lg:relative top-0 left-0 h-full z-30 w-64
          flex flex-col border-r
          transition-transform duration-300
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{
          background: '#0d0d14',
          borderColor: 'rgba(255,255,255,0.06)',
          minWidth: '260px',
          maxWidth: '260px',
        }}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #4f9eff20, #a78bfa20)', border: '1px solid rgba(79,158,255,0.3)' }}>
              <span className="gradient-text font-black text-lg">P</span>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2"
                style={{ borderColor: '#0d0d14' }} />
            </div>
            <div>
              <h1 className="font-bold text-sm gradient-text">Projectra AI</h1>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>● Online</p>
            </div>
          </div>
        </div>

        {/* Mode label */}
        <div className="px-5 pt-5 pb-2">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            Mode
          </p>
        </div>

        {/* Mode buttons */}
        <nav className="flex flex-col gap-1.5 px-3 flex-1 overflow-y-auto">
          {MODES.map((m) => {
            const Icon = m.icon
            const isActive = mode === m.id
            const colors = COLOR_MAP[m.color]

            return (
              <motion.button
                key={m.id}
                onClick={() => { onModeChange(m.id); onMobileClose?.() }}
                whileHover={{ scale: 1.01, x: 2 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  w-full flex items-center gap-3 px-3 py-3 rounded-xl
                  border transition-all duration-200 text-left
                  ${isActive
                    ? colors.active
                    : 'border-transparent hover:border-white/5 hover:bg-white/[0.03]'
                  }
                `}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                  ${isActive ? colors.active : 'bg-white/[0.04]'}`}>
                  <Icon size={16} className={isActive ? colors.icon : 'text-text-secondary'} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${isActive ? 'text-text-primary' : 'text-text-secondary'}`}>
                    {m.label}
                  </p>
                  <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                    {m.description}
                  </p>
                </div>
                {isActive && (
                  <ChevronRight size={14} className={colors.icon} />
                )}
              </motion.button>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t space-y-3" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <Link to="/build">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm text-white transition-all cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #a78bfa, #f472b6)', boxShadow: '0 0 20px rgba(167,139,250,0.3)' }}
            >
              <Sparkles size={16} />
              Build Mode
            </motion.div>
          </Link>
          <motion.button
            onClick={onNewChat}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm text-white transition-all"
            style={{ background: 'linear-gradient(135deg, #4f9eff, #a78bfa)', boxShadow: '0 0 20px rgba(79,158,255,0.25)' }}
          >
            <Plus size={16} />
            New Chat
          </motion.button>
          <p className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>
            💡 Switch modes anytime
          </p>
        </div>
      </aside>
    </>
  )
}
