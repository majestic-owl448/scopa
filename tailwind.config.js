/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fcc: {
          'primary-bg': '#0a0a23',
          'secondary-bg': '#1b1b32',
          'tertiary-bg': '#2a2a40',
          'quaternary-bg': '#3b3b4f',
          'primary-fg': '#ffffff',
          'secondary-fg': '#f5f6f7',
          'tertiary-fg': '#dfdfe2',
          'quaternary-fg': '#d0d0d5',
          'muted': '#858591',
          'purple': '#dbb8ff',
          'yellow': '#f1be32',
          'yellow-gold': '#ffbf00',
          'blue': '#99c9ff',
          'green': '#acd157',
          'red': '#ffadad',
          'danger': '#850000',
          'blue-mid': '#198eee',
        },
      },
      fontFamily: {
        sans: ['Lato', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['Hack-ZeroSlash', 'Fira Mono', 'Menlo', 'Consolas', 'monospace'],
      },
      fontSize: {
        base: '18px',
      },
    },
  },
  plugins: [],
}
