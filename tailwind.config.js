/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        navy: {
          800: '#0B132B',
          900: '#1C2541',
          950: '#0A0E1A',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 15px rgba(245, 158, 11, 0.4)',
        'gold-glow-lg': '0 0 25px rgba(245, 158, 11, 0.6)',
        'blue-glow': '0 0 15px rgba(28, 37, 65, 0.5)',
      }
    },
  },
  plugins: [],
}
