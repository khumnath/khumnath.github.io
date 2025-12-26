/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'selector',
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4dabf7',
          DEFAULT: '#3389de',
          dark: '#1c6ca8',
        },
      },
    },
  },
  plugins: [],
}
