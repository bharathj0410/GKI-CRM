const { heroui } = require("@heroui/theme");
const path = require("path");

// Resolve the absolute path to the theme package to bypass symlink issues with bun/pnpm
const herouiThemePath = path.dirname(require.resolve("@heroui/theme/package.json"));

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    path.join(herouiThemePath, "dist/**/*.{js,ts,jsx,tsx}"),
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
