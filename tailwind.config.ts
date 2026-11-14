import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#08080B",
          900: "#0C0C11",
          850: "#101017",
          800: "#15151D",
          700: "#1D1D27",
          600: "#272733",
          500: "#38384A",
          400: "#55556B",
          300: "#7C7C93",
          200: "#A6A6B8",
          100: "#D2D2DC",
          50: "#EDEDF2",
        },
        paper: {
          50: "#FBF8F2",
          100: "#F5EFE3",
          200: "#EDE3CE",
          300: "#DFCFAF",
          400: "#C9B187",
          500: "#B3905C",
        },
        ember: {
          300: "#FFD68A",
          400: "#FFC15E",
          500: "#F5A623",
          600: "#D98613",
          700: "#A85F0C",
        },
        signal: {
          ok: "#4ADE80",
          warn: "#FBBF24",
          bad: "#F87171",
          info: "#60A5FA",
        },
      },
      fontFamily: {
        display: [
          "Iowan Old Style",
          "Palatino Linotype",
          "Palatino",
          "Georgia",
          "Songti SC",
          "STSong",
          "SimSun",
          "serif",
        ],
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "PingFang SC",
          "Hiragino Sans GB",
          "Microsoft YaHei",
          "system-ui",
          "sans-serif",
        ],
        mono: [
          "SF Mono",
          "JetBrains Mono",
          "Cascadia Mono",
          "Consolas",
          "ui-monospace",
          "monospace",
        ],
      },
      boxShadow: {
        plate: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 24px 60px -32px rgba(0,0,0,0.9)",
        glow: "0 0 0 1px rgba(245,166,35,0.28), 0 0 42px -8px rgba(245,166,35,0.35)",
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(to right, rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.045) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "42px 42px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        caret: {
          "0%, 45%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        breathe: {
          "0%, 100%": { opacity: "0.42", transform: "scale(1)" },
          "50%": { opacity: "0.9", transform: "scale(1.06)" },
        },
        sweep: {
          "0%": { transform: "translateX(-110%)" },
          "100%": { transform: "translateX(210%)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.7" },
          "70%": { transform: "scale(1.6)", opacity: "0" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
      },
      animation: {
        "fade-up": "fade-up 420ms cubic-bezier(0.22,1,0.36,1) both",
        caret: "caret 1.1s steps(1) infinite",
        breathe: "breathe 4.2s ease-in-out infinite",
        sweep: "sweep 2.4s linear infinite",
        "pulse-ring": "pulse-ring 1.8s ease-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
