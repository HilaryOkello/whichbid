import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // WhichBid color palette
        brand: {
          purple: {
            DEFAULT: "#4D148C",
            light: "#6B21A8",
            dark: "#3B0F6B",
            50: "#F3E8FF",
            100: "#E9D5FF",
            200: "#D8B4FE",
          },
          orange: {
            DEFAULT: "#FF6200",
            light: "#FF8533",
            dark: "#CC4E00",
            50: "#FFF7ED",
            100: "#FFEDD5",
          },
          gray: {
            50: "#F9FAFB",
            100: "#F3F4F6",
            200: "#E5E7EB",
            300: "#D1D5DB",
            400: "#9CA3AF",
            500: "#6B7280",
            600: "#4B5563",
            700: "#374151",
            800: "#1F2937",
            900: "#111827",
          },
        },
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-slow": "bounce 2s infinite",
        "spin-slow": "spin 2s linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
