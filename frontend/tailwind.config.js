/** @format */

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        350: "repeat(1, minmax(350px, 1fr))",
      },
    },
  },
  plugins: [],
};
