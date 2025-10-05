/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6B3F69',
        secondary: '#8D5F8C',
        accent: '#A376A2',
        background: '#FFF5F7',
        surface: '#FFFFFF',
        'surface-muted': '#DDC3C3',
        success: '#27ae60',
        warning: '#f39c12',
        error: '#e74c3c',
        'text-primary': '#2d1b2e',
        'text-secondary': '#6B3F69',
        'text-muted': '#8D5F8C',
        border: '#DDC3C3',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(107, 63, 105, 0.08)',
        'medium': '0 4px 16px rgba(107, 63, 105, 0.12)',
        'large': '0 8px 32px rgba(107, 63, 105, 0.16)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
}