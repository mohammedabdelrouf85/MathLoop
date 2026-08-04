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
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981', // Main emerald
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        fire: {
          light: '#a3e635',
          glow: '#22c55e',
          neon: '#00ff66',
        },
        cyber: {
          bg: '#070a12',
          card: 'rgba(13, 20, 36, 0.75)',
          accent: '#00ffaa',
          cyan: '#06b6d4',
          purple: '#8b5cf6',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-emerald': '0 0 30px rgba(16, 185, 129, 0.4)',
        'glow-neon': '0 0 45px rgba(0, 255, 170, 0.65)',
        'glow-cyan': '0 0 35px rgba(6, 182, 212, 0.5)',
        'glow-fire': '0 0 40px rgba(34, 197, 94, 0.6)',
        'card-soft': '0 10px 30px -5px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
        'card-glass': '0 8px 32px 0 rgba(0, 255, 170, 0.12)',
        'inner-glow': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(16, 185, 129, 0.3)' },
          '50%': { boxShadow: '0 0 35px rgba(16, 185, 129, 0.8)' },
        },
        firePulse: {
          '0%, 100%': { transform: 'scale(1)', filter: 'drop-shadow(0 0 10px #00ff66)' },
          '50%': { transform: 'scale(1.03)', filter: 'drop-shadow(0 0 25px #00ff66)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translate(0px, 0px)' },
          '50%': { transform: 'translate(15px, -15px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s infinite ease-in-out',
        'fire-pulse': 'firePulse 1.2s infinite ease-in-out',
        'float': 'float 3s infinite ease-in-out',
        'float-slow': 'floatSlow 8s infinite ease-in-out',
        'shimmer': 'shimmer 2.5s infinite linear',
      }
    },
  },
  plugins: [],
}
