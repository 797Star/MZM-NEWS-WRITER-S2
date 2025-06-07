import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E3A8A', // Deep Blue
          light: '#2563EB',
          dark: '#1E40AF',
        },
        accent: {
          DEFAULT: '#F59E0B', // Warm Gold/Amber
          light: '#FBBF24',
          dark: '#D97706',
        },
        success: {
          DEFAULT: '#059669', // Emerald Green
          light: '#10B981',
          dark: '#047857',
        },
        neutral: { // Adding a more complete neutral palette
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['Pyitaungsu', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
