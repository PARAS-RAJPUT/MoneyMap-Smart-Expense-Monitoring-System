/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        royal: {
          50: "#f0f4ff",
          100: "#dbeafe",
          200: "#bfd7fe",
          300: "#93b9fd",
          400: "#6095fa",
          500: "#3b76f6",
          600: "#2558eb",
          700: "#1d44d6",
          800: "#1e3a8a",
          900: "#1e3a8a",
          950: "#0f172a"
        },
        emerald: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
          950: "#022c22"
        }
      },
      fontFamily: {
        sans: ["Satoshi", "sans-serif"],
        display: ["General Sans", "sans-serif"]
      }
    }
  },
  plugins: []
};
