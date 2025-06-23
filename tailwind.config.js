/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fade-in 0.6s ease-out',
        'scale-in': 'scale-in 0.5s ease-out',
        'slide-in-left': 'slide-in-left 0.6s ease-out',
        'float-star': 'float-star 6s ease-in-out infinite',
      },
      keyframes: {
        'fade-in': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'scale-in': {
          '0%': {
            opacity: '0',
            transform: 'scale(0.9)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        'slide-in-left': {
          '0%': {
            opacity: '0',
            transform: 'translateX(-50px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        'float-star': {
          '0%': { transform: 'translateY(0) translateX(0)' },
          '25%': { transform: 'translateY(-2px) translateX(2px)' },
          '50%': { transform: 'translateY(1px) translateX(-2px)' },
          '75%': { transform: 'translateY(-1px) translateX(1px)' },
          '100%': { transform: 'translateY(0) translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}