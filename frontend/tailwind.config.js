/** @type {import('tailwindcss').Config} */
var myTheme = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      sizes: {
        "bar-h": "52px",
        "sidebar-w": "52px",
        "content-w": "calc(100vw - %sizes.sidebar-w%)",
        "content-h": "calc(100vh - %sizes.bar-h%)"
      },
      colors: {
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

        // LIGHT
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
      },
      borderWidth: {
        "default": 0,
        "panel-default": 0,
        "input-default": 1,
        "button-default": 1
      },
      borderRadius: {
        "default": 0,
        "panel-default": 5,
        "input-default": 5,
        "button-default": 3
      },
      keyframes: {
        "skeleton-fade": {
          "0%": { transform: "translate(-100%,0%)", background: "linear-gradient(90deg,transparent ,#fff1,#58a3,#fff1 ,transparent)" },
          "100%": { transform: "translate(100%,0%)", background: "linear-gradient(90deg,transparent,#fff1,#58a3,#fff1,transparent)" }
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
      },

    },
  },
  plugins: []
}

// Mini plugin to support variable links (%my.var%)
Object.keys(myTheme.theme.extend).forEach(style => {
  Object.keys(myTheme.theme.extend[style]).forEach(each => {
    
    let v = myTheme.theme.extend[style][each]
   
    const regx = /%[a-z\-A-Z]+?\.[a-z\-A-Z]+?%/g
    
    if (regx.test(v)) {
      v = v.replace(regx, (r) => {
        const splited = r.slice(1, r.length - 1).split(".")
        const newValue = splited.reduce((acum, next) => {
          return acum[next]
        }, myTheme.theme.extend)

        return newValue
      })
      myTheme.theme.extend[style][each] = v
    }
  })
})


const keysToSet = ["width", "height", "margin", "borderWidth", "padding", "inset","minHeight","minWidth"]
keysToSet.forEach(k => {
  if (myTheme.theme.extend[k]) {
    myTheme.theme.extend[k] = { ...myTheme.theme.extend[k], ...myTheme.theme.extend.sizes }
  }
  else myTheme.theme.extend[k] = myTheme.theme.extend.sizes
})

module.exports = myTheme

