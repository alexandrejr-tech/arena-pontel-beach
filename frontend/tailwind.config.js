/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#03A7D6',
        'primary-dark': '#0288a8',
        'primary-light': '#4fc3e0',
        secondary: '#F5F5F5',
        dark: '#1a1a2e',
        'dark-light': '#16213e',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
