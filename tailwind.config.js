/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0F172A',
          card: '#1E293B',
          accent: '#06B6D4', // cyan-500
          teal: '#14B8A6',
          warning: '#F59E0B',
          danger: '#EF4444',
          purple: '#8B5CF6',
          pink: '#EC4899'
        }
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
      }
    },
  },
  plugins: [],
}
