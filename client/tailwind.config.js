/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class', // Enable dark mode based on a CSS class
  theme: {
    extend: {
      colors: {
        // Define colors for both light and dark themes
        light: {
          background: colors.gray[100],
          text: colors.gray[900],
          primary: colors.blue[600],
          accent: colors.blue[400],
        },
        dark: {
          background: colors.gray[900],
          text: colors.gray[100],
          primary: colors.blue[400],
          accent: colors.blue[300],
        },
      },
    },
  },
  plugins: [],
}
