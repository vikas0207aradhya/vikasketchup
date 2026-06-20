/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        void: '#0a0807',
        surface: '#1a1411',
        ember: '#c98a6b',
        emberlight: '#e3ac8c',
        bone: '#f5ece4',
        muted: '#6b5c54',
        hairline: '#3a2e28',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
      animation: {
        breathe: 'breathe 3.5s ease-in-out infinite',
        drift: 'drift 60s linear infinite',
        rise: 'rise 0.8s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { opacity: '0.55', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.15)' },
        },
        drift: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        rise: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
