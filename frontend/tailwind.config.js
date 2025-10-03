/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#5e9eff",
        secondary: "#85c2ff",
        backgroundLight: "#c4d6eb",
        surface: "#ffebfa",
        textDark: "#1e293b",
      }
    },
  },
  plugins: [],
};
