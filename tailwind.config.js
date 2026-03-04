/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#000000',
        'background-light': '#F8F5F1',
        'background-dark': '#121212',
        accent: '#000000',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Bebas Neue', 'sans-serif'],
        logo: ['Poppins', 'sans-serif'],
        menu: ['ABCDiatype', 'sans-serif'],
        heading: ['Items', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
