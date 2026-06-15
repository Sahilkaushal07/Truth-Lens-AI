/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#09090b',
          card: 'rgba(15, 15, 23, 0.65)',
          purple: '#7c3aed',
          cyan: '#06b6d4',
          rose: '#f43f5e',
          emerald: '#10b981',
          border: 'rgba(255, 255, 255, 0.08)'
        }
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(135deg, #0f172a 0%, #020617 100%)',
        'neon-glow': 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, rgba(9,9,11,0) 70%)',
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace']
      },
      boxShadow: {
        'neon-cyan': '0 0 15px rgba(6, 182, 212, 0.4)',
        'neon-purple': '0 0 15px rgba(124, 58, 237, 0.4)',
        'neon-rose': '0 0 15px rgba(244, 63, 94, 0.4)',
      }
    },
  },
  plugins: [],
}
