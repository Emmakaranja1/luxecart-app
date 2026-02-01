/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00F5FF',
          dark: '#00C5D0',
          light: '#5FFAFF',
        },
        secondary: {
          DEFAULT: '#FF00FF',
          dark: '#D000D0',
          light: '#FF5AFF',
        },
        accent: {
          DEFAULT: '#FFD700',
          dark: '#D4AF37',
          light: '#FFED4E',
        },
        dark: {
          DEFAULT: '#0A0A0F',
          card: '#151520',
          lighter: '#1F1F2E',
        }
      },
      fontFamily: {
        display: ['Montserrat', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(0, 245, 255, 0.5)',
        'glow-secondary': '0 0 20px rgba(255, 0, 255, 0.5)',
        'glow-accent': '0 0 20px rgba(255, 215, 0, 0.5)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #00F5FF 0%, #00C5D0 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #FF00FF 0%, #D000D0 100%)',
        'gradient-hero': 'linear-gradient(135deg, #00F5FF 0%, #FF00FF 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(0, 245, 255, 0.1) 0%, rgba(255, 0, 255, 0.1) 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 245, 255, 0.5)' },
          '50%': { boxShadow: '0 0 30px rgba(255, 0, 255, 0.8)' },
        },
      },
    },
  },
  plugins: [],
}
