import daisyui from "daisyui"

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      "aqua",
      "business",
      "night",
      "dracula",
      "coffee",
      "forest",
      "cyberpunk",
      "synthwave",
      "luxury",
      "pastel",
      "retro",,
      "autumn",
      "valentine",
    ]
  }

}