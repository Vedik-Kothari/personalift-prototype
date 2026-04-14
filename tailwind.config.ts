import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./store/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#08111f",
        foreground: "#f4f7fb",
        card: "rgba(255,255,255,0.06)",
        primary: "#6ee7b7",
        accent: "#38bdf8",
        muted: "#94a3b8",
        danger: "#fb7185"
      },
      boxShadow: {
        panel: "0 30px 120px rgba(0, 0, 0, 0.35)"
      }
    }
  },
  plugins: []
};

export default config;
