/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-mulish)", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
      },
      colors: {
        bg: "#f2f1ec",
        surface: "#ffffff",
        surface2: "#f8f7f3",
        border: "#e5e2da",
        border2: "#ccc9be",
        ink: "#18170f",
        ink2: "#6b6858",
        ink3: "#a09d93",
        green: { DEFAULT: "#2a5c3f", light: "#e6f0ea", 2: "#4a8c62" },
        red: { DEFAULT: "#b03a3a", light: "#faeaea" },
        gold: { DEFAULT: "#9a7c10", light: "#faf5e0" },
        blue: { DEFAULT: "#2e4fa3", light: "#eaeffd" },
        orange: { DEFAULT: "#b05c20", light: "#fdf0e6" },
      },
      boxShadow: {
        card: "0 1px 4px rgba(0,0,0,.05), 0 4px 20px rgba(0,0,0,.04)",
      },
      borderRadius: { card: "10px" },
    },
  },
  plugins: [],
}
