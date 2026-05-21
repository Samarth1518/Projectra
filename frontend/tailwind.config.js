/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#050508',
        'bg-secondary': '#0d0d14',
        'bg-card': '#12121c',
        'neon-blue': '#4f9eff',
        'neon-purple': '#a78bfa',
        'neon-cyan': '#22d3ee',
      },
      boxShadow: {
        'neon': '0 0 20px rgba(79,158,255,0.3), 0 0 40px rgba(79,158,255,0.1)',
        'neon-purple': '0 0 20px rgba(167,139,250,0.3)',
      },
    },
  },
  plugins: [],
}
