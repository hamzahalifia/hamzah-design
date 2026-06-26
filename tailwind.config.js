/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // ─── Typography ──────────────────────────────────────────────────────────
      // Based on Figma text styles: Inter font family
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Inter', 'sans-serif'],
        accent: ['"Prof. Bens"', 'serif'], // Figma: EL-b1841217 "Portfolio" label
      },
      fontSize: {
        // Figma text style scale
        'xs':    ['12px', { lineHeight: '16px' }],           // xs/normal, xs/medium
        'sm':    ['14px', { lineHeight: '20px' }],           // sm/normal, sm/medium
        'base':  ['16px', { lineHeight: '24px' }],           // Text md/Regular, base/semibold
        'lg':    ['18px', { lineHeight: '28px' }],           // lg/semibold
        '2xl':   ['24px', { lineHeight: '36px' }],           // 2xl/semibold
        '3xl':   ['30px', { lineHeight: '40px' }],           // 3xl/semibold
        '4xl':   ['36px', { lineHeight: '44px' }],           // Display md/Regular
        '5xl':   ['48px', { lineHeight: '48px' }],           // 5xl/semibold
        '6xl':   ['60px', { lineHeight: '64px' }],           // attio display
        '7xl':   ['96px', { lineHeight: '96px' }],           // Figma hero: Product Designer
      },
      letterSpacing: {
        'display': '-0.02em',   // Display md/Regular
        'heading': '-0.015em',  // attio.com/Inter/Regular
        'tight':   '-0.01em',   // base/semibold, lg/semibold
        'tighter': '-0.005em',  // sm styles
      },
      // ─── Semantic Colors ─────────────────────────────────────────────────────
      // Derived from Figma variables & fills
      colors: {
        // ── Brand / Accent ──
        brand: {
          DEFAULT: '#15803D',   // EL-b1841217 "Portfolio" label color
          light:   '#ECFDF3',   // badge background (EL-9096bc26)
          dark:    '#085D3A',   // badge text (EL-5173e90a)
        },
        // ── Text ──
        text: {
          primary:    '#0F172A', // EL-a81675ee "Product Designer" heading
          dark:       '#101828', // fill_dbb4f91a
          DEFAULT:    '#344054', // EL-61c348c0 "Alifia Hamzah" name fill_c18a7d8b
          secondary:  '#475467', // fill_5684afc7
          tertiary:   '#525866', // ts1 fills
          muted:      '#98A2B3', // fill_6cc2af8e
          placeholder:'#D0D5DD', // fill_39b03f46
        },
        // ── Background ──
        bg: {
          DEFAULT: '#FFFFFF',   // fill_658ab2fa
          subtle:  '#F9FAFB',   // fill_8cfa905d
          muted:   '#F3F4F6',   // fill_e6606459
          soft:    '#F4F4F5',   // fill_4ea4bfae
          warm:    '#FDF7ED',   // fill_726f7ebc
        },
        // ── Border ──
        border: {
          DEFAULT: '#E4E4E7',   // fill_48c54f3b
          light:   '#E5E7EB',   // fill_b8e4da24 / attio.com/Athens Gray (1:2777)
          strong:  '#D4D4D8',   // fill_30c9a17d
          divider: '#D0D5DD',   // fill_39b03f46
        },
        // ── Surface ──
        surface: {
          DEFAULT: '#FFFFFF',
          raised:  '#F9FAFB',
          overlay: 'rgba(16, 24, 40, 0.05)',  // effect_0da657b9 shadow base
        },
      },
      // ─── Box Shadows ─────────────────────────────────────────────────────────
      boxShadow: {
        'card':  '0px 1.35px 2.71px 0px rgba(16, 24, 40, 0.05)',           // effect_0da657b9
        'float': '0px 32.51px 65.03px -16.26px rgba(16, 24, 40, 0.18)',    // effect_c0f46891
        'avatar':'0px 45.52px 91.04px -22.76px rgba(16, 24, 40, 0.18)',    // EL-2dfa943d
        'button':'0px 1px 3px 0px rgba(0,0,0,0.04), 0px 0px 2px 0px rgba(28,40,64,0.18)', // effect_bf92749c
      },
      // ─── Border Radius ───────────────────────────────────────────────────────
      borderRadius: {
        'pill': '9999px',
        'card': '8px',
      },
      // ─── Animations ──────────────────────────────────────────────────────────
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '0.4' },
          '50%':      { opacity: '0.8' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'spin-slow': {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'fade-up':    'fade-up 0.6s ease-out forwards',
        'fade-up-d1': 'fade-up 0.6s ease-out 0.1s forwards',
        'fade-up-d2': 'fade-up 0.6s ease-out 0.2s forwards',
        'fade-up-d3': 'fade-up 0.6s ease-out 0.3s forwards',
        'fade-up-d4': 'fade-up 0.6s ease-out 0.4s forwards',
        'fade-in':    'fade-in 1s ease-out forwards',
        'pulse-slow': 'pulse-slow 3s ease-in-out infinite',
        'float':      'float 4s ease-in-out infinite',
        'shimmer':    'shimmer 3s linear infinite',
        'spin-slow':  'spin-slow 20s linear infinite',
      },
      // ─── Background Gradients ────────────────────────────────────────────────
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'shimmer-text': 'linear-gradient(90deg, #0F172A 0%, #15803D 40%, #0F172A 60%, #0F172A 100%)',
      },
    },
  },
  plugins: [],
}
