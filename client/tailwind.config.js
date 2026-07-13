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
          950: '#17110C', // full-bleed dark sections
          900: '#241C15', // cards/panels on dark
          700: '#4A3826',
        },
        parchment: {
          50: '#F7F3EA',
          100: '#F1EAD9',
        },
        ink: {
          800: '#2B2620',
          500: '#6E6255',
          400: '#8A7D6C', // added: needed for disabled/placeholder text, was missing
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
          400: '#6B9A5C', // added: components already reference this
          500: '#4F7942',
          600: '#436938',
          700: '#375530',
        },
        // Data/AI accent — warm gold, harvest reference
        maize: {
          50:  '#FBF3DE',
          100: '#F5E4B0',
          400: '#E8B93F',
          500: '#D6A62C',
          600: '#B68A1F', // added: components already reference this
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
      // Named display scale — Fraunces optical-size axis is meant to shift
      // per size, so these aren't arbitrary; each maps to an intentional
      // opsz/weight pairing rather than a linear ramp.
      fontSize: {
        'display-hero': ['clamp(3.5rem, 9vw, 9rem)', { lineHeight: '0.95', letterSpacing: '-0.02em', fontWeight: '340' }],
        'display-xl': ['clamp(2.5rem, 5vw, 4rem)', { lineHeight: '1.05', letterSpacing: '-0.01em', fontWeight: '500' }],
        'display-lg': ['clamp(2rem, 3.5vw, 2.75rem)', { lineHeight: '1.1', fontWeight: '500' }],
        'display-md': ['clamp(1.5rem, 2.5vw, 1.875rem)', { lineHeight: '1.15', fontWeight: '500' }],
        'eyebrow': ['0.6875rem', { lineHeight: '1', letterSpacing: '0.14em', fontWeight: '600' }],
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
      backgroundImage: {
        // Signal gradient — the one recurring accent tied to the contour-line
        // signature device. Use sparingly: the line itself, rare CTA edges.
        'signal': 'linear-gradient(90deg, #B5522E 0%, #4F7942 50%, #D6A62C 100%)',
        'signal-vertical': 'linear-gradient(180deg, #B5522E 0%, #4F7942 50%, #D6A62C 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'signal-draw': 'signalDraw 1.8s cubic-bezier(0.65, 0, 0.35, 1) forwards',
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
        signalDraw: {
          from: { strokeDashoffset: 'var(--signal-length, 2000)' },
          to: { strokeDashoffset: '0' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}