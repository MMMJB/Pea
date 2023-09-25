/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx}", "./*.html"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        pea: {
          light: "#F1F5E0",
          mid: "#D4DEAE",
          dark: "#99B048",
          brand: "#8EAB12"
        },
        text: {
          light: "#57622A",
          dark: "#656957"
        }
      }
    },
  },
  plugins: [],
};
