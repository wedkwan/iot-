/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#309633",
        secondary: "#004b8d",
        accent: "#f59e0b",

        "background-light": "#f8fafc",
        "background-dark": "#0f172a",

        "card-light": "#ffffff",
        "card-dark": "#1e293b",

        "text-primary": "#1f2937",
        "text-secondary": "#6b7280",

        "border-light": "#e5e7eb",
        "border-dark": "#374151",
      },

      fontFamily: {
        display: ["Inter", "system-ui", "sans-serif"],
      },

      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.5rem",
        full: "9999px",
      },
    },
  },
  plugins: [],
};
