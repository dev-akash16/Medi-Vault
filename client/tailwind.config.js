/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        medivault: {
          50: '#F0F6FF',
          100: '#E0EEFE',
          200: '#BAE0FD',
          300: '#7CC8FB',
          400: '#38ACF7',
          500: '#0E90E9',
          600: '#0272C7',
          700: '#035BA1',
          800: '#173B65', // Primary brand dark blue
          900: '#0B1728', // Deep navy
          950: '#060D17',
        },
        teal: {
          50: '#F0FDFA',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
        },
        cyan: {
          400: '#22D3EE',
          500: '#06B6D4',
        },
        surface: '#FFFFFF',
        canvas: '#F5F8FC',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 15px -3px rgba(11, 23, 40, 0.05), 0 4px 6px -2px rgba(11, 23, 40, 0.03)',
        card: '0 4px 20px -2px rgba(23, 59, 101, 0.06), 0 2px 6px -1px rgba(23, 59, 101, 0.04)',
        hover: '0 12px 28px -4px rgba(23, 59, 101, 0.12), 0 4px 10px -2px rgba(23, 59, 101, 0.06)',
      },
    },
  },
  plugins: [],
};
