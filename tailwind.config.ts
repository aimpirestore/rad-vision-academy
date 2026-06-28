import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: "#B11226",
          "red-deep": "#7A0A19",
          black: "#1A1A1A",
          white: "#FFFFFF",
          "light-grey": "#F5F5F5",
          silver: "#C0C0C0",
          "dark-grey": "#444444",
        },
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-2xl": ["clamp(3.5rem, 8vw, 6.5rem)", { lineHeight: "1.02", letterSpacing: "-0.03em", fontWeight: "700" }],
        "display-xl": ["clamp(2.75rem, 6vw, 4.5rem)", { lineHeight: "1.05", letterSpacing: "-0.025em", fontWeight: "700" }],
        "display-lg": ["clamp(2rem, 4.5vw, 3.25rem)", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
      },
      boxShadow: {
        "soft": "0 1px 2px rgba(26,26,26,0.04), 0 8px 24px rgba(26,26,26,0.06)",
        "soft-lg": "0 2px 4px rgba(26,26,26,0.05), 0 24px 60px rgba(26,26,26,0.10)",
        "soft-xl": "0 8px 12px rgba(122,10,25,0.08), 0 40px 100px rgba(122,10,25,0.14)",
        "glow": "0 0 0 1px rgba(177,18,38,0.12), 0 12px 40px rgba(177,18,38,0.20)",
        "inner-line": "inset 0 0 0 1px rgba(26,26,26,0.06)",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      backgroundImage: {
        "radial-fade": "radial-gradient(circle at 50% 0%, rgba(177,18,38,0.06), transparent 60%)",
        "grid-subtle": "linear-gradient(rgba(26,26,26,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(26,26,26,0.04) 1px, transparent 1px)",
      },
      backgroundSize: {
        "grid-lg": "64px 64px",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "scan-line": {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translateY(100%)", opacity: "0" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.8)", opacity: "0.6" },
          "100%": { transform: "scale(2.2)", opacity: "0" },
        },
        "marquee": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.6s ease-out forwards",
        "float-slow": "float-slow 8s ease-in-out infinite",
        "scan-line": "scan-line 6s ease-in-out infinite",
        "pulse-ring": "pulse-ring 3s ease-out infinite",
        "marquee": "marquee 40s linear infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
