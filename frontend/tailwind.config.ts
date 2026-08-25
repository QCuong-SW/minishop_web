import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/context/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        shopee: {
          orange: "#ee4d2d",
          hover: "#d73211",
          light: "#fef6f5",
          accent: "#ff5722",
          dark: "#1e293b",
          border: "#fed7aa",
        },
        minishop: {
          orange: "#ee4d2d",
          hover: "#d73211",
          light: "#fef6f5",
          accent: "#ff5722",
          dark: "#1e293b",
          border: "#fed7aa",
        },
      },
      boxShadow: {
        glow: "0 0 20px -5px rgba(238, 77, 45, 0.3)",
        card: "0 4px 20px -2px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [],
};
export default config;
