/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
      },
      colors: {
        textPrimary: "#000000",
        textSecondary: "#4D4D4D",
        primaryBlue: "#3f3d55",
        accentBlue: "#6d66fa",
        backgroundWhite: "#e8e8e8",
        backgroundGrey: "#d9d9d9",
        lightGrey: "#F0F0F0",
      },
    },
  },
  plugins: [],
};
