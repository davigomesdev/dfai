import { colors } from './src/constants/colors';

import tailwindcssAnimate from 'tailwindcss-animate';
import tailwindcssScrollbar from 'tailwind-scrollbar';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors,
      fontFamily: {
        'rigid-square': ['RigidSquare', 'sans-serif'],
      },
      animation: {
        blink: 'blink 1s infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [tailwindcssAnimate, tailwindcssScrollbar],
};
