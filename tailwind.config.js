/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "fofan-bg": "#020617",
      },
      boxShadow: {
        "glass-lg":
          "0 18px 45px rgba(15,23,42,0.9), 0 0 0 1px rgba(148,163,184,0.25)",
      },
    },
  },
  plugins: [],
};
