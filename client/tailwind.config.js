/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Neutral / base — warm parchment system
        soil: {
          900: '#241C15',
          700: '#4A3826',
        },
        parchment: {
          50: '#F7F3EA',
          100: '#F1EAD9',
        },
        ink: {
          800: '#2B2620',
          500: '#6E6255',
        },
        border: {
          DEFAULT: '#E4DCC8',
        },
        // Signature accent — laterite (burnt orange-red, clay)
        laterite: {
          50:  '#FBEEE8',
          100: '#F5D9CA',
          400: '#C56A44',
          500: '#B5522E',
          600: '#9A4526',
          700: '#7C3720',
        },
        // Working green — desaturated botanical
        acacia: {
          50:  '#EEF3EC',
          100: '#D9E5D4',
          500: '#4F7942',
          600: '#436938',
        },
        // Data/AI accent — warm gold, harvest reference
        maize: {
          50:  '#FBF3DE',
          100: '#F5E4B0',
          400: '#E8B93F',
          500: '#D6A62C',
        },
        // Semantic status
        status: {
          danger: '#B23A2E',
          warning: '#D6A62C',
          success: '#4F7942',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '2px',
        sm: '1px',
        md: '2px',
        lg: '2px',
        xl: '2px',
        '2xl': '2px',
        full: '9999px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
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