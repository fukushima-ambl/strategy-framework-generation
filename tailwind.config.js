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
        navy: {
          50: '#e8edf5',
          100: '#c5d0e6',
          500: '#2D7DD2',
          700: '#1B3A6B',
          900: '#0d1f3c',
        }
      }
    },
  },
  plugins: [],
}
