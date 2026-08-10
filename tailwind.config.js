/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.tsx",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        /* ── Core UI ─────────────────────────── */
        primary: {
          DEFAULT: "#6C5CE7",
          light: "#A29BFE",
          dark: "#4A3DB8",
        },
        secondary: {
          DEFAULT: "#00CEC9",
          light: "#55EFC4",
          dark: "#00A89D",
        },
        accent: {
          DEFAULT: "#FDCB6E",
          light: "#FFEAA7",
          dark: "#E0A830",
        },

        /* ── Surfaces & Backgrounds ──────────── */
        background: {
          DEFAULT: "#0F0E17",
          soft: "#161528",
        },
        surface: {
          DEFAULT: "#1E1D2F",
          elevated: "#2A2940",
          bright: "#363552",
        },

        /* ── Text ────────────────────────────── */
        text: {
          DEFAULT: "#FFFFFE",
          muted: "#94A1B2",
          inverse: "#0F0E17",
        },

        /* ── Borders ─────────────────────────── */
        border: {
          DEFAULT: "#2A2940",
          strong: "#363552",
        },

        /* ── Status ──────────────────────────── */
        success: {
          DEFAULT: "#00B894",
          light: "#55EFC4",
        },
        warning: {
          DEFAULT: "#FDCB6E",
          light: "#FFEAA7",
        },
        danger: {
          DEFAULT: "#FF6B6B",
          light: "#FF8A8A",
          dark: "#D63031",
        },

        /* ── Game Block Colors ───────────────── */
        block: {
          red: "#FF4757",
          orange: "#FF9F43",
          yellow: "#FFCB2B",
          green: "#2ED573",
          blue: "#2E86FF",
          indigo: "#5F27CD",
          purple: "#C44FFF",
          pink: "#FF6B9D",
          cyan: "#00D2FF",
        },
      },

      borderRadius: {
        game: "12px",
        "game-lg": "16px",
        "game-xl": "20px",
      },

      fontFamily: {
        game: ["System"],
      },

      spacing: {
        "game-cell": "40px",
      },
    },
  },
  plugins: [],
};
