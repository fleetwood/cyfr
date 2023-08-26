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
        ibarra: ['Ibarra', 'serif'],
        'ibarra-italic': ['IbarraItalic', 'serif'],
      },
      animation: {
        'flip-right': 'flip-right 0.2s ease-in-out',
        'flip-left': 'flip-left 0.2s ease-in-out',
      },
      keyframes: {
        'flip-right': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(180deg)' },
        },
        'flip-left': {
          '0%': { transform: 'rotate(180deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
      },
      colors: {
        "paper": '#F6F6F4',
        "typography": '#636354',
        "amaranth": '#E0234C',
        "apple": '#7CBA1A',
        "citrine": '#EFD102',
        "ebony": '#636354',
        "palatinate": '#5A0C4A',
        'persian-green': '#00A396',
        'picton-blue': '#00A4D6',
        "plum": '#993399',
        "silver": '#F6F6F4',
        "vesuvius": '#f49d0c',
      },
    },
  },
  daisyui: {
    styled: true,
    base: true,
    utils: true,
    prefix: '',
    themes: [
      {
        commadoor: {
          "primary":    '#993399',
          "secondary":  '#00A396',
          "accent":     '#00A4D6',
          "neutral":    '#636354',
          'base-100':   '#F6F6F4',
          "info":       '#00A4D6',
          "success":    '#7CBA1A',
          "warning":    '#EFA402',
          "error":      '#E0234C',
        },
      },
    ],
  },
  plugins: [
    require('daisyui'),
    require('@tailwindcss/forms'),
    require('tailwind-scrollbar-hide'),
    require('tailwind-scrollbar'),
  ],
}