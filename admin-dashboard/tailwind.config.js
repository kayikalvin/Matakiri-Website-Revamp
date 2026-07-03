/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Neutral / base — warm parchment system, not gray-50
        soil: {
          900: '#241C15', // near-black, warm — sidebar, dark surfaces
          700: '#4A3826', // secondary dark
        },
        parchment: {
          50: '#F7F3EA',  // page background
          100: '#F1EAD9', // subtle recessed panels
        },
        ink: {
          800: '#2B2620', // primary text
          500: '#6E6255', // muted text
        },
        border: {
          DEFAULT: '#E4DCC8',
        },
        // Signature accent — laterite, not Claude-terracotta (redder/clayer, checked against #D97757)
        laterite: {
          50:  '#FBEEE8',
          100: '#F5D9CA',
          400: '#C56A44',
          500: '#B5522E', // primary accent
          600: '#9A4526', // hover/active
          700: '#7C3720',
        },
        // Working green — desaturated botanical, replaces uniform SaaS-green primary
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
        // Semantic status — kept distinct from brand accents
        status: {
          danger: '#B23A2E',
          warning: '#D6A62C',
          success: '#4F7942',
        },
      },
      fontFamily: {
        // Display — Fraunces, used large/light, ledger-meets-institution character
        display: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
        // Body/UI — clean, does not compete with display
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        // Data/mono — numbers, table data, IDs. Instrument-panel feel.
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      borderRadius: {
        // Sharper, more deliberate — max 2px, ties to instrument/ledger feel
        DEFAULT: '2px',
        sm: '1px',
        md: '2px',
        lg: '2px',
        xl: '2px',
        '2xl': '2px',
        full: '9999px', // keep for avatars only
      },
      backgroundImage: {
        'woven': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Cpath d='M0 0h12v12H0zM12 12h12v12H12z' fill='%23F7F3EA' fill-opacity='0.04'/%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'ticker': 'ticker 40s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}