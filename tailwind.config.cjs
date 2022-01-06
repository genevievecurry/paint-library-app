module.exports = {
  content: ['./src/**/*.svelte', './src/**/*.css'],
  theme: {},
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography'),
  ],
};
