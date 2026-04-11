/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        shopee: {
          50:  '#fff3f0',
          100: '#ffe4de',
          200: '#ffbcb0',
          400: '#f47051',
          500: '#ee4d2d',
          600: '#d73211',
          700: '#b52a0e',
        }
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
