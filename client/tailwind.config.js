/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#0A0E17',
          card: 'rgba(15, 23, 42, 0.75)',
          border: 'rgba(56, 189, 248, 0.15)',
          safe: '#10B981',
          moderate: '#F59E0B',
          risk: '#EF4444',
          cyan: '#06B6D4',
          accent: '#3B82F6',
          glow: '#0284C7'
        }
      },
      boxShadow: {
        'glow-safe': '0 0 20px rgba(16, 185, 129, 0.35)',
        'glow-risk': '0 0 25px rgba(239, 68, 68, 0.45)',
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.35)',
        'glow-card': '0 8px 32px 0 rgba(0, 0, 0, 0.5)'
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scanLine 4s linear infinite',
        'float': 'floatAnim 6s ease-in-out infinite'
      },
      keyframes: {
        scanLine: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' }
        },
        floatAnim: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' }
        }
      }
    },
  },
  plugins: [],
}
