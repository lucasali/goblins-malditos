/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'goblin-green': '#4a6741',
        'goblin-dark': '#2c3e2e',
        'goblin-brown': '#8b6d5c',
        'goblin-gray': '#5e5e5e',
        'parchment': '#f5e8c9',
      },
      fontFamily: {
        goblin: ['Goblin One', 'serif'],
        parchment: ['Papyrus', 'fantasy'],
      },
    },
  },
  plugins: [],
}
