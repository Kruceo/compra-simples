/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
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
        // toolbar: "#151515",
        // bar: "#131313",
        // sidebar: "#151515",
        // subpanel: "#171717",
        // submit: "#56f",
        // "submit-text": "#222",
        // notification: "#202020",
        // background: "#171717",
        // "default-text": "#c0c0c0",
        // borders: "#262626",
        // hovers: "#222",
        // selected: "#224"

        bar: "#dfe4f9",
        sidebar: "#eef0f7",
        toolbar: "#f2f4fb",
        headers: "#f2f4fb",
        subpanel: "#fcfcfc",
        submit: "#f2f4fb",
        "submit-text": "#535584",
        notification: "#f2f4fb",
        background: "#fcfcfc",
        "default-text": "#535584",
        borders: "#ccc8",
        hovers: "#ccf",
        selected: "#aaf"

        // bar: "#434349",
        // sidebar: "#434349",
        // toolbar: "#3d3d43",
        // headers: "#3d3d43",
        // subpanel: "#434349",
        // submit: "#22242b",
        // "submit-text": "#999999",
        // notification: "#f2f4fb",
        // background: "#39393f",
        // "default-text": "#cce",
        // borders: "#ccc2",
        // hovers: "#161622",
        // selected: "#162222"

      },
      borderWidth: {
        "default": 0,
        "panel-default": 0,
        "input-default": 1,
        "button-default": 1
      },
      borderRadius: {
        "default": 0,
        "panel-default": 0,
        "input-default": 5,
        "button-default": 3
      },
      keyframes: {
        "skeleton-fade": {
          "0%": { transform: "translate(-100%,0%)", background: "linear-gradient(90deg,transparent ,#fff1,#58a1,#fff1 ,transparent)" },
          "100%": { transform: "translate(100%,0%)", background: "linear-gradient(90deg,transparent,#fff1,#58a1,#fff1,transparent)" }
        },
        "explode": {
          "0%": {
            "outline": "0px solid",
            "outline-offset": "0px"
          },
          "50%": {
            "outline": "5px solid",
            "outline-offset": "2px"
          },
          "100%": {
            "outline": "0px solid",
            "outline-offset": "5px"
          }

        }
      },
      animation: {
        "explode": "explode 500ms both linear",
        "skeleton-fade": "skeleton-fade 1s infinite linear",
      }
    },
  },
  plugins: []
}

