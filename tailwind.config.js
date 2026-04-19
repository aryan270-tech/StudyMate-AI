/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        ink: {
          50:  '#f0f0f5',
          100: '#e2e2ef',
          200: '#c4c4df',
          300: '#9696c4',
          400: '#6868a9',
          500: '#4b4b8f',
          600: '#3a3a72',
          700: '#2d2d58',
          800: '#1e1e3c',
          900: '#12122a',
          950: '#0a0a1a',
        },
        acid: {
          DEFAULT: '#b4ff4e',
          dim: '#8fd438',
        },
        coral: {
          DEFAULT: '#ff6b6b',
          dim: '#e05555',
        },
        sky: {
          soft: '#7dd3fc',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        slideUp: {
          from: { opacity: 0, transform: 'translateY(16px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
