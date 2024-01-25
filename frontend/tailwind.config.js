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
        fifth:"#9900cc",
        borders:"#0002",
        hovers:"#0001",

        toolbar:"#fff",
        bar:"#eaeaff",
        sidebar:"#efefff",
        subpanel:"#eee"
      },
    },
  },
  plugins: [],
}

