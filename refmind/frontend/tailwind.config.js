/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        pitch: {
          900: '#0a1f14',
          800: '#0f2e1c',
          700: '#164028',
          600: '#1e5234',
        },
        accent: {
          gold: '#f5c542',
          red: '#e63946',
          green: '#2ecc71',
        },
      },
      fontFamily: {
        display: ['Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
