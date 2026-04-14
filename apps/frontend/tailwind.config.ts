import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#F9F6F1",
        ink: "#0E0C0A",
        "brand-blue": "#1A56FF",
        "brand-blue-soft": "#EEF2FF",
        "brand-orange": "#FF6B2B",
        "brand-purple": "#7B5EA7",
        "brand-green": "#19A667",
        "brand-red": "#EF4444",
        border: "rgba(14,12,10,0.10)",
      },
      fontFamily: {
        sans: ["'DM Sans'", "sans-serif"],
        serif: ["'Instrument Serif'", "serif"],
      },
      boxShadow: {
        brand: "0 2px 24px rgba(14,12,10,0.06)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
