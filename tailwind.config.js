/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nomad: {
          50: '#f4f6f5',
          100: '#e3e8e6',
          200: '#c5d0cc',
          300: '#9bada6',
          400: '#768a82',
          500: '#596e67',
          600: '#455651',
          700: '#3a4642',
          800: '#313a37',
          900: '#29302e',
        }
      },
      fontFamily: {
        serif: ['Merriweather', 'serif'],
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}