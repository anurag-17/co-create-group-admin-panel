/** @type {import('tailwindcss').Config} */

const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      "theme-color": "#535bb5fa",
      "theme_secondary": "#7980cdfa",
      primary: "#C21494",
      black: "#000",
      white:"#fff",
      menu_primary : "#313a46",
      menu_secondary:"#b8bbdf47",
    },
    extend: {},
  },
  plugins: [],
};
