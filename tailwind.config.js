/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './node_modules/tailwind-datepicker-react/dist/**/*.js',
  ],
  theme: {
    extend: {
      fontFamily: {
      'ibarra': ['Ibarra', 'serif'],
      'ibarra-italic': ['IbarraItalic', 'serif'],
    },
    animation: {
      'flip-right': 'flip-right 0.2s ease-in-out',
      'flip-left': 'flip-left 0.2s ease-in-out',
    },
    keyframes: {
      'flip-right': { 
        '0%': { transform: 'rotate(0deg)' }, 
        '100%': { transform: 'rotate(180deg)' } 
      },
      'flip-left': { 
        '0%': { transform: 'rotate(180deg)' }, 
        '100%': { transform: 'rotate(0deg)' } }
    }
  },
},
  daisyui: {
    styled: true,
    base: true,
    utils: true,
    prefix: "",
    themes: [
      "emerald",
    ],
  },
  plugins: [
    require("daisyui"),
    require('@tailwindcss/forms'),
    require('tailwind-scrollbar-hide'),
    require('tailwind-scrollbar'),
  ],
}