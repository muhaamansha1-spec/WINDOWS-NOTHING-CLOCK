/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        nothing: {
          black: '#000000',
          white: '#FFFFFF',
          gray: {
            50: '#FAFAFA',
            100: '#F5F5F5',
            200: '#E5E5E5',
            300: '#D4D4D4',
            400: '#A3A3A3',
            500: '#737373',
            600: '#525252',
            700: '#404040',
            800: '#262626',
            900: '#171717',
            950: '#0A0A0A',
          },
        },
        // Semantic colors
        bg: {
          primary: '#000000',
          secondary: '#0A0A0A',
          tertiary: '#171717',
          card: '#171717',
          'card-hover': '#1F1F1F',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#A3A3A3',
          tertiary: '#737373',
          disabled: '#404040',
        },
        border: {
          primary: '#262626',
          secondary: '#404040',
          focus: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['var(--app-font, Inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--app-font, "JetBrains Mono")', 'Fira Code', 'monospace'],
        dot: ['var(--app-font, DotGothic16)', 'JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'clock-xs': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.1em' }],
        'clock-sm': ['1rem', { lineHeight: '1.5rem', letterSpacing: '0.1em' }],
        'clock-base': ['1.5rem', { lineHeight: '2rem', letterSpacing: '0.1em' }],
        'clock-lg': ['3rem', { lineHeight: '3.5rem', letterSpacing: '0.05em' }],
        'clock-xl': ['6rem', { lineHeight: '6.5rem', letterSpacing: '0.02em' }],
        'clock-2xl': ['10rem', { lineHeight: '10.5rem', letterSpacing: '0em' }],
        'clock-3xl': ['14rem', { lineHeight: '14.5rem', letterSpacing: '-0.02em' }],
        'display-xl': ['4rem', { lineHeight: '4.5rem', letterSpacing: '-0.02em', fontWeight: '200' }],
        'display-lg': ['3rem', { lineHeight: '3.5rem', letterSpacing: '-0.01em', fontWeight: '200' }],
        'display-md': ['2.25rem', { lineHeight: '2.75rem', letterSpacing: '0em', fontWeight: '200' }],
        'display-sm': ['1.5rem', { lineHeight: '2rem', letterSpacing: '0.01em', fontWeight: '300' }],
      },
      spacing: {
        'space-18': '4.5rem',
        'space-22': '5.5rem',
        'space-26': '6.5rem',
        'space-30': '7.5rem',
      },
      borderRadius: {
        'card': '1.5rem',
        'card-lg': '2rem',
        'pill': '9999px',
      },
      borderWidth: {
        'hairline': '0.5px',
        'thin': '1px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-dot': 'pulseDot 1.5s ease-in-out infinite',
        'tick': 'tick 1s steps(1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
        tick: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
      },
      transitionDuration: {
        'fast': '150ms',
        'normal': '250ms',
        'slow': '350ms',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      boxShadow: {
        'card': '0 4px 24px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        'card-hover': '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        'focus': '0 0 0 2px #FFFFFF',
      },
    },
  },
  plugins: [],
}