/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
  ],
  theme: {
    extend: {
    }
  },
  plugins: [
    require('prettier-plugin-tailwindcss'),
    require("tailwindcss-animate"),
  ],
  corePlugins: {
    // preflight: false,
  },
  // important: '#root',
}