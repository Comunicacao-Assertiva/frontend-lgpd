import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        teal: {
          50:  '#E1F5EE',
          100: '#C3EBD7',
          200: '#9FE1CB',
          300: '#5DCAA5',
          400: '#1D9E75',
          500: '#1D9E75',
          600: '#0F6E56',
          700: '#0F6E56',
          800: '#085041',
          900: '#04342C',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Segoe UI', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
