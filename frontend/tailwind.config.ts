import type { Config } from "tailwindcss";

const config: Config = {
  // ── Dark mode via class ──────────────────────────────────────────────────────
  darkMode: "class",

  // ── Content paths ────────────────────────────────────────────────────────────
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx}",
    "./src/hooks/**/*.{js,ts,jsx,tsx}",
    "./src/context/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    // ── Container ──────────────────────────────────────────────────────────────
    container: {
      center: true,
      padding: {
        DEFAULT: "1.5rem",
        sm: "2rem",
        lg: "3rem",
        xl: "4rem",
        "2xl": "5rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1400px",
      },
    },

    extend: {
      // ── Font Families ─────────────────────────────────────────────────────────
      fontFamily: {
        display: ["Playfair Display", "Georgia", '"Times New Roman"', "serif"],
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ['"Fira Code"', '"Cascadia Code"', "Consolas", "monospace"],
      },

      // ── Font Sizes ───────────────────────────────────────────────────────────
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "1rem" }],
        xs: ["0.75rem", { lineHeight: "1.125rem" }],
        sm: ["0.875rem", { lineHeight: "1.375rem" }],
        base: ["1rem", { lineHeight: "1.625rem" }],
        md: ["1.0625rem", { lineHeight: "1.7rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.875rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.375rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.75rem" }],
        "5xl": ["3rem", { lineHeight: "3.5rem" }],
        "6xl": ["3.75rem", { lineHeight: "4.25rem" }],
        "7xl": ["4.5rem", { lineHeight: "5rem" }],
        "8xl": ["6rem", { lineHeight: "6.5rem" }],
        "9xl": ["8rem", { lineHeight: "8.5rem" }],
      },

      // ── Custom Colors ─────────────────────────────────────────────────────────
      colors: {
        // Gold spectrum — anchored at #C9A84C
        gold: {
          50: "#fdf8ec",
          100: "#faefd4",
          200: "#f4dda9",
          300: "#ecc772",
          400: "#e3ab44",
          500: "#c9a84c",
          600: "#b8922e",
          700: "#9a7524",
          800: "#7e5e23",
          900: "#684e20",
          950: "#3c2c10",
          DEFAULT: "#c9a84c",
        },

        // Charcoal — brand deep black
        charcoal: {
          50: "#f5f5f5",
          100: "#e8e8e8",
          200: "#d0d0d0",
          300: "#a8a8a8",
          400: "#737373",
          500: "#525252",
          600: "#3d3d3d",
          700: "#2a2a2a",
          800: "#1a1a1a",
          900: "#111111",
          950: "#0d0d0d",
          DEFAULT: "#0d0d0d",
        },

        // Cream — warm off-white
        cream: {
          50: "#fffdf8",
          100: "#fdf8ec",
          200: "#f9f0d8",
          300: "#f5ecd7",
          400: "#ede0c4",
          500: "#e0d0ab",
          600: "#c8b48a",
          700: "#aa9068",
          800: "#8a7050",
          900: "#6e5840",
          DEFAULT: "#f5ecd7",
        },

        // Status Colors
        success: {
          50: "#f0fdf4",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          DEFAULT: "#22c55e",
        },
        warning: {
          50: "#fffbeb",
          500: "#f59e0b",
          600: "#d97706",
          DEFAULT: "#f59e0b",
        },
        danger: {
          50: "#fef2f2",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          DEFAULT: "#ef4444",
        },
        info: {
          50: "#eff6ff",
          500: "#3b82f6",
          600: "#2563eb",
          DEFAULT: "#3b82f6",
        },
      },

      // ── Border Radius ─────────────────────────────────────────────────────────
      borderRadius: {
        none: "0",
        sm: "0.375rem",
        DEFAULT: "0.5rem",
        md: "0.625rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
        "4xl": "2.5rem",
        full: "9999px",
      },

      // ── Box Shadows ───────────────────────────────────────────────────────────
      boxShadow: {
        sm: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        DEFAULT: "0 2px 8px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.05)",
        md: "0 4px 12px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.05)",
        lg: "0 10px 30px rgba(0,0,0,0.10), 0 4px 10px rgba(0,0,0,0.06)",
        xl: "0 20px 50px rgba(0,0,0,0.12), 0 8px 20px rgba(0,0,0,0.08)",
        "2xl": "0 30px 70px rgba(0,0,0,0.15), 0 12px 30px rgba(0,0,0,0.10)",
        gold: "0 4px 20px rgba(201,168,76,0.30), 0 2px 8px rgba(201,168,76,0.15)",
        "gold-lg": "0 8px 30px rgba(201,168,76,0.40), 0 4px 12px rgba(201,168,76,0.20)",
        card: "0 2px 12px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.05)",
        glow: "0 0 30px rgba(201,168,76,0.20)",
        "glow-lg": "0 0 50px rgba(201,168,76,0.30)",
        inner: "inset 0 2px 6px rgba(0,0,0,0.08)",
        "inner-gold": "inset 0 2px 6px rgba(201,168,76,0.15)",
        none: "none",
      },

      // ── Animations ────────────────────────────────────────────────────────────
      animation: {
        shimmer: "shimmer 3s linear infinite",
        "shimmer-fast": "shimmer 1.5s linear infinite",
        fadeIn: "fadeIn 0.4s ease forwards",
        slideUp: "slideUp 0.5s ease forwards",
        slideDown: "slideDown 0.4s ease forwards",
        slideInRight: "slideInRight 0.35s cubic-bezier(0.32,0.72,0,1) forwards",
        slideOutRight: "slideOutRight 0.30s cubic-bezier(0.32,0.72,0,1) forwards",
        scaleIn: "scaleIn 0.25s ease forwards",
        float: "float 4s ease-in-out infinite",
        "spin-slow": "spinSlow 3s linear infinite",
        "pulse-gold": "pulseGold 2s ease infinite",
        "bounce-gentle": "bounceGentle 1.5s ease-in-out infinite",
      },

      // ── Keyframes ─────────────────────────────────────────────────────────────
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "0% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          from: { opacity: "0", transform: "translateY(-16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          from: { opacity: "0", transform: "translateX(100%)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        slideOutRight: {
          from: { opacity: "1", transform: "translateX(0)" },
          to: { opacity: "0", transform: "translateX(100%)" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.9)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        spinSlow: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(201,168,76,0.4)" },
          "50%": { boxShadow: "0 0 0 12px rgba(201,168,76,0)" },
        },
        bounceGentle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },

      // ── Spacing ───────────────────────────────────────────────────────────────
      spacing: {
        "13": "3.25rem",
        "15": "3.75rem",
        "17": "4.25rem",
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
        "30": "7.5rem",
        "34": "8.5rem",
        "38": "9.5rem",
        "42": "10.5rem",
        "46": "11.5rem",
        "50": "12.5rem",
        "58": "14.5rem",
        "66": "16.5rem",
        "72": "18rem",
        "84": "21rem",
        "96": "24rem",
        "112": "28rem",
        "128": "32rem",
        "144": "36rem",
        "160": "40rem",
        "navbar": "4.5rem",
      },

      // ── Max Widths ────────────────────────────────────────────────────────────
      maxWidth: {
        "8xl": "88rem",
        "9xl": "96rem",
        "10xl": "112rem",
        "screen-2xl": "1400px",
        "prose-lg": "75ch",
      },

      // ── Backdrop Blur ─────────────────────────────────────────────────────────
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        "2xl": "40px",
      },

      // ── Z-Index ───────────────────────────────────────────────────────────────
      zIndex: {
        "-1": "-1",
        "1": "1",
        "2": "2",
        "60": "60",
        "70": "70",
        "80": "80",
        "90": "90",
        "100": "100",
        navbar: "200",
        overlay: "300",
        modal: "400",
        toast: "500",
      },

      // ── Letter Spacing ────────────────────────────────────────────────────────
      letterSpacing: {
        tightest: "-0.04em",
        tighter: "-0.02em",
        tight: "-0.01em",
        normal: "0em",
        wide: "0.025em",
        wider: "0.05em",
        widest: "0.1em",
        "widest-xl": "0.15em",
        luxury: "0.2em",
      },

      // ── Line Heights ──────────────────────────────────────────────────────────
      lineHeight: {
        tightest: "1.1",
        tighter: "1.2",
        tight: "1.35",
        snug: "1.45",
        normal: "1.6",
        relaxed: "1.75",
        loose: "2",
      },

      // ── Transition Duration ───────────────────────────────────────────────────
      transitionDuration: {
        "0": "0ms",
        "75": "75ms",
        "100": "100ms",
        "150": "150ms",
        "200": "200ms",
        "250": "250ms",
        "300": "300ms",
        "400": "400ms",
        "500": "500ms",
        "700": "700ms",
        "1000": "1000ms",
      },

      // ── Background Gradients ──────────────────────────────────────────────────
      backgroundImage: {
        "gradient-gold": "linear-gradient(135deg, #e3ab44 0%, #c9a84c 50%, #9a7524 100%)",
        "gradient-gold-shimmer":
          "linear-gradient(90deg, #c9a84c 0%, #e3ab44 25%, #f4dda9 50%, #e3ab44 75%, #c9a84c 100%)",
        "gradient-charcoal": "linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)",
        "gradient-radial": "radial-gradient(ellipse at center, var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "noise": "url('/images/noise.png')",
      },
    },
  },

  // ── Plugins ──────────────────────────────────────────────────────────────────
  plugins: [],
};

export default config;
