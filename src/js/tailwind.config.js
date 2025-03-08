/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./../../index.html"],
  theme: {
    extend: {
      colors: {
        primary: "#0f172a",
        secondary: "#00a2f7",
      },
      backgroundColor: {
        primary: "#0f172a",
        secondary: "#00a2f7",
      },
      borderColor: {
        primary: "#0f172a",
        secondary: "#00a2f7",
      },
      aspectRatio: {
        "4/3": "4/3",
      },
    },
  },
  plugins: [],
};
