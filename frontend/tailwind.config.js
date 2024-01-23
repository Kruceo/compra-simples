/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        first: '#eaeaff',
        second: '#efefff',
        third: '#eeeeee',
        fourth: '#aaaaff',//subpanels
        fifth:"#9900cc"
      },
    },
  },
  plugins: [],
}

