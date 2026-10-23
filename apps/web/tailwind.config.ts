import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ivory: '#FAF7F2',
        cream: '#F1E8DC',
        sand: '#E6D4BE',
        sage: '#A6B5A0',
        forest: {
          DEFAULT: '#344B3C',
          light: '#425D4C',
          dark: '#27382D',
        },
        terracotta: {
          DEFAULT: '#B96F52',
          light: '#C98267',
          dark: '#9F5C43',
        },
        'dark-brown': '#352F29',
        'muted-brown': '#786F65',
      },
      fontFamily: {
        sans: ['var(--font-instrument-sans)', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['var(--font-instrument-serif)', 'ui-serif', 'Georgia', 'Cambria', 'serif'],
      },
      boxShadow: {
        warm: '0 4px 20px -2px rgba(53, 47, 41, 0.05)',
        'warm-lg': '0 10px 30px -4px rgba(53, 47, 41, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
