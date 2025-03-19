module.exports = {
  theme: {
    extend: {
      fontFamily: {
        archivo: ["Archivo", "sans-serif"], // Add your custom font family
        inter: ["Inter", "sans-serif"], // Add your custom font family
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar"),
    require("tailwind-scrollbar-hide"), // Optional for hiding scrollbars
  ],
};
