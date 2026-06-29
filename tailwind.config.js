/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['"Instrument Serif"', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        attio: {
          bg: {
            light: '#FFFFFF',
            dark: '#0A0A0B',
            'subtle-light': '#FAFAFA',
            'subtle-dark': '#121215',
            'footer-light': '#FAFAFB',
            'footer-dark': '#080809',
          },
          text: {
            'primary-light': '#111827',
            'primary-dark': '#F4F4F5',
            'secondary-light': '#6B7280',
            'secondary-dark': '#A1A1AA',
            'muted-light': '#9CA3AF',
            'muted-dark': '#52525B',
          },
          border: {
            'light': '#CDD1CD',
            'dark': '#27272A',
            'subtle-light': '#E5E7EB',
            'subtle-dark': '#18181B',
          }
        }
      },
      boxShadow: {
        'attio-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'attio-md': '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        'attio': '8px',
        'attio-lg': '16px',
        'attio-pill': '9999px',
      },
      animation: {
        'shimmer-spin': 'shimmer-spin 3s linear infinite',
        'shimmer-slide': 'shimmer-slide 3s ease-in-out infinite alternate',
      },
      keyframes: {
        'shimmer-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'shimmer-slide': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
}
