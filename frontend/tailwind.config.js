/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        toolbar:"#fff",
        bar:"#eaeaff",
        sidebar:"#efefff",
        subpanel:"#eee",
        submit:"#66f",
        notification:"#ddf",
        background:"#fff",
        "default-text":"#222",
        borders:"#0002",
        hovers:"#0001",

        // toolbar:"#202020",
        // bar:"#151515",
        // sidebar:"#151515",
        // subpanel:"#202020",
        // submit:"#66f",
        // notification:"#202020",
        // background:"#101010",
        // "default-text":"#e0e0e0",
        // borders:"#fff2",
        // hovers:"#0001",
      },
    },
  },
  plugins: [],
}

