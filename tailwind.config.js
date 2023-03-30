/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
      'ibarra': ['Ibarra', 'serif'],
      'ibarra-italic': ['IbarraItalic', 'serif'],
    },
  },
},
  daisyui: {
    styled: true,
    base: true,
    utils: true,
    prefix: "",
    themes: [
      "cmyk",
      "autumn",
      "luxury",
      "winter",
      "coffee",
      "pastel",
      "fantasy",
      "lofi",
      "wireframe",
      "black",
      "emerald",
      "dark",
      "light",
    ],
  },
  plugins: [
    require("daisyui"),
    require('@tailwindcss/forms'),
    require('tailwind-scrollbar-hide'),
    require('tailwind-scrollbar'),
  ],
}
