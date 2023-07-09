module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        '350': 'repeat(1, minmax(350px, 1fr))',
      }
    },
  },
  plugins: [],
}