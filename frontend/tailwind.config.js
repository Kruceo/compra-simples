/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {

        // toolbar: "#fff",
        // bar: "#eaeaff",
        // sidebar: "#efefff",
        // subpanel: "#eee",
        // submit: "#66f",
        // "submit-text": "#222",
        // notification: "#ddf",
        // background: "#fff",
        // "default-text": "#222",
        // borders: "#0002",
        // hovers: "#0001",

        // DARK
        toolbar: "#151515",
        bar: "#131313",
        sidebar: "#151515",
        subpanel: "#171717",
        submit: "#56f",
        "submit-text": "#222",
        notification: "#202020",
        background: "#171717",
        "default-text": "#c0c0c0",
        borders: "#262626",
        hovers: "#222",
        selected:"#224"

        // toolbar: "#753341",
        // bar: "#722233",
        // sidebar: "#773344",
        // subpanel: "#553344",
        // submit: "#44ff44",
        // "submit-text": "#222",
        // notification: "#202020",
        // background: "#331122",
        // "default-text": "#c0c0c0",
        // borders: "#442233",
        // hovers: "#664455",
        // selected:"#997788"

      },
    },
  },
  plugins: [],
}

