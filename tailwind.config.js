/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx}",
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBG: "#191919",
        darkBG2: "#1e1e1e",
        darkBG3: "#121212",
        lightBG: "#f8f8f8",
        lightBG2: "#f9f9f9",
        lightBG3: "#dfdfdf",
      },
    },
  },
  plugins: [],
};
