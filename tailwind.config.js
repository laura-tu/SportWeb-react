/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'], // Paths to all your template files
  darkMode: 'class', // Enable dark mode based on a CSS class
  theme: {
    extend: {
      screens: {
        xxs: '340px',
        xs: '420px',
        sm: '640px',
        md: '768px',
        lg: '970px',
        xl: '1024px',
        hd: '1280px',
        '2xl': '1920px',
        '3xl': '2560px',
      },
      colors: {
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
};
