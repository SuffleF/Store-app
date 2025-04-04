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
      "forest",
      "cyberpunk",
      "synthwave",
      "luxury",
      "dracula",
      "pastel",
      "retro",
      "coffee",
      "autumn",
      "valentine",
    ]
  }

}