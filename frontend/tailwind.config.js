/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        pastel: {
          50:  '#fff0f6',
          100: '#ffe4f0',
          200: '#ffc2de',
          300: '#ff91c1',
          400: '#ff5fa0',
          500: '#f9387f',
          600: '#e8185e',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif']
      }
    }
  },
  plugins: []
};
