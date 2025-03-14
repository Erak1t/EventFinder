/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        "slide-up": "slideUp 1s ease-in-out forwards 5s", // 2s затримка перед стартом
      },
      keyframes: {
        slideUp: {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(-100px)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
