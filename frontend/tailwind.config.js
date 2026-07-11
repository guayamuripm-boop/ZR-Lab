/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'zr-navy': '#21284F',
        'zr-blue': '#1E4D96',
        'zr-blue-mid': '#3869B1',
        'zr-blue-soft': '#6590CB',
        'zr-sky': '#98BAE3',
        'zr-white': '#FFFFFF',
        success: '#34C98E',
        warning: '#F5B841',
        danger: '#E5484D',
        gold: '#E8C468',
      },
      fontFamily: {
        display: ['Raleway', 'sans-serif'],
        body: ['Roboto', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
      transitionTimingFunction: {
        liquid: 'cubic-bezier(0.32, 0.72, 0.24, 1)',
      },
    },
  },
  plugins: [],
};
