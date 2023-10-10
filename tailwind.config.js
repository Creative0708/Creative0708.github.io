/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'mono': ['"JetBrains Mono"', 'sans-serif'],
      },
      colors: {
        'base': {
          100: "#e600a2",
          150: "#d800aa",
          200: "#ca00af",
          250: "#bc00b2",
          300: "#a900ae",
          350: "#8f00a0",
          400: "#770092",
          450: "#610084",
          500: "#4d0077",
          550: "#3b0069",
          600: "#2c005b",
          650: "#1f004d",
          700: "#14003f",
          750: "#0c0031",
          800: "#060023",
          850: "#020015",
          900: "#000007",
        }
      }
    },
  },
  plugins: [],
};