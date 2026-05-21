import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Particle canvas background
function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        color: Math.random() > 0.5 ? '79,158,255' : '167,139,250',
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(79,158,255,${0.1 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${p.opacity})`;
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });

      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}

export default function LandingPage() {
  const navigate = useNavigate();

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white overflow-hidden font-sans">
      {/* Fixed Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 glass px-6 py-4 flex justify-between items-center">
        <div className="font-bold text-2xl gradient-text">Projectra AI</div>
        <button 
          onClick={() => navigate('/chat')}
          className="px-5 py-2 rounded-xl text-white font-medium border border-blue-500 hover:neon-glow transition-all duration-300 bg-blue-500/10"
        >
          Launch App →
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex flex-col justify-center items-center text-center px-4 pt-20">
        <ParticleCanvas />
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          <motion.h1 
            initial="hidden" animate="visible" variants={fadeUp}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-2 text-white"
          >
            Build Smarter.
          </motion.h1>
          <motion.h1 
            initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight gradient-text mb-6"
          >
            Ship Faster.
          </motion.h1>
          <motion.p 
            initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10"
          >
            Your AI-powered developer assistant. From idea to deployment — project roadmaps, tech stack advice, and hackathon MVP plans, instantly.
          </motion.p>
          
          <motion.div 
            initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full justify-center"
          >
            <button 
              onClick={() => navigate('/chat')}
              className="px-8 py-4 bg-blue-500 text-white rounded-xl font-bold text-lg hover:bg-blue-400 neon-glow transition-all duration-300"
            >
              Start Building →
            </button>
            <a 
              href="#features"
              className="px-8 py-4 bg-transparent text-white border border-gray-600 rounded-xl font-bold text-lg hover:bg-white/5 transition-all duration-300"
            >
              See Features
            </a>
          </motion.div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 -mt-20 mb-32">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="glass rounded-2xl p-8 flex flex-col items-center justify-center text-center">
            <div className="text-5xl font-black text-blue-400 mb-2 neon-glow">4</div>
            <div className="text-gray-300 font-medium">AI Modes</div>
          </div>
          <div className="glass rounded-2xl p-8 flex flex-col items-center justify-center text-center">
            <div className="text-5xl font-black text-purple-400 mb-2" style={{ textShadow: '0 0 20px rgba(167,139,250,0.5)' }}>∞</div>
            <div className="text-gray-300 font-medium">Project Ideas</div>
          </div>
          <div className="glass rounded-2xl p-8 flex flex-col items-center justify-center text-center">
            <div className="text-5xl font-black text-cyan-400 mb-2" style={{ textShadow: '0 0 20px rgba(34,211,238,0.5)' }}>0</div>
            <div className="text-gray-300 font-medium">Signup Required</div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-[#050508] relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Everything you need to build</h2>
            <p className="text-gray-400 text-lg">Four specialized AI modes designed for every stage of your development journey.</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="glass rounded-2xl p-8 border-l-4 border-l-blue-500 hover:bg-white/5 transition-colors">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-2xl font-bold text-white mb-3">AI Project Roadmaps</h3>
              <p className="text-gray-400">Get complete development roadmaps in seconds. From architecture to deployment — fully detailed.</p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.1 }} className="glass rounded-2xl p-8 border-l-4 border-l-yellow-500 hover:bg-white/5 transition-colors">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold text-white mb-3">Hackathon Mode</h3>
              <p className="text-gray-400">Build MVPs fast. Skip everything non-essential. Get only what you need to ship in 24 hours.</p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.2 }} className="glass rounded-2xl p-8 border-l-4 border-l-purple-500 hover:bg-white/5 transition-colors">
              <div className="text-4xl mb-4">🛠</div>
              <h3 className="text-2xl font-bold text-white mb-3">Stack Advisor</h3>
              <p className="text-gray-400">Get opinionated tech stack recommendations with comparison tables and clear winners.</p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.3 }} className="glass rounded-2xl p-8 border-l-4 border-l-green-500 hover:bg-white/5 transition-colors">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-2xl font-bold text-white mb-3">Beginner Friendly</h3>
              <p className="text-gray-400">Simple explanations. Student-first approach. We explain WHY — not just what to type.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 bg-[#0d0d14] relative z-10 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-3xl md:text-5xl font-bold text-center text-white mb-16"
          >
            How it works
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center text-blue-400 text-2xl font-bold mb-6">1</div>
              <h3 className="text-xl font-bold text-white mb-3">Ask</h3>
              <p className="text-gray-400">Describe your project idea or what you want to build</p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.1 }} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center text-purple-400 text-2xl font-bold mb-6">2</div>
              <h3 className="text-xl font-bold text-white mb-3">Get Roadmap</h3>
              <p className="text-gray-400">Receive a complete development plan with stack, phases, and timeline</p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.2 }} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-400 text-2xl font-bold mb-6">3</div>
              <h3 className="text-xl font-bold text-white mb-3">Start Building</h3>
              <p className="text-gray-400">Follow the step-by-step guide and ship your project</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 px-6 relative z-10 flex flex-col justify-center items-center text-center border-t border-white/5" style={{ background: 'linear-gradient(180deg, #050508 0%, rgba(79,158,255,0.05) 100%)' }}>
        <motion.h2 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="text-4xl md:text-5xl font-bold text-white mb-6"
        >
          Ready to build your <span className="gradient-text">next project?</span>
        </motion.h2>
        <motion.p 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.1 }}
          className="text-gray-400 text-lg mb-10 max-w-2xl"
        >
          No signup. No credit card. Just your ideas and AI.
        </motion.p>
        <motion.button 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.2 }}
          onClick={() => navigate('/chat')}
          className="px-10 py-4 bg-blue-500 text-white rounded-xl font-bold text-lg hover:bg-blue-400 neon-glow transition-all duration-300"
        >
          Start Building →
        </motion.button>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/10 bg-[#050508] relative z-10 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="font-bold text-xl gradient-text">Projectra AI</div>
        <div className="text-gray-500 text-sm">Built by Samarth N G</div>
        <div className="text-gray-500 text-sm">© 2025</div>
      </footer>
    </div>
  );
}
