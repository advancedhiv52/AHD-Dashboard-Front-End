/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "#365193",
        "primary-light": "#337AB7",
        orange: "#F68D3F",
        yellow: "#FAE595 ",
        grey: "#838383 ",
      },
      fontFamily: {
        raleway: ["var(--font-raleway)"],
        sans: ["var(--font-open_sans)"],
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
