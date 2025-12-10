/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eafaf6',
          100: '#d4f3ea',
          200: '#bfeee0',
          300: '#a9e8d6',
          400: '#94e2cc',
          500: '#009970',
          600: '#008760',
          700: '#007050',
        },
        accent: {
          50: '#eaf6fa',
          100: '#d4ecf3',
          200: '#bfe2ed',
          300: '#a9d8e7',
          400: '#94cee1',
          500: '#5bb5a2',
          600: '#489e8c',
          700: '#357876',
        },
        neutral: {
          100: '#f5f5f5',
          200: '#eeeeee',
          300: '#e0e0e0',
          400: '#bdbdbd',
        }
      },
      fontFamily: {
        sans: ['Montserrat', 'Open Sans', 'sans-serif'],
        display: ['Montserrat', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
