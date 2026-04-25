const { heroui } = require("@heroui/theme");

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/react/dist/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/button/dist/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/input/dist/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/card/dist/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/form/dist/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/*/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["var(--font-poppins)", "sans-serif"],
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};

module.exports = config;
