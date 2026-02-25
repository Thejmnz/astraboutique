/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#A68463',
        'background-light': '#F9F7F2',
        'background-dark': '#121212',
        accent: '#A68463',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Instrument Serif', 'serif'],
      },
    },
  },
  plugins: [],
}
