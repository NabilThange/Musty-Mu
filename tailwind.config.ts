import type { Config } from "tailwindcss"
import { fontFamily } from "tailwindcss/defaultTheme"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // MUSTY brand colors
        musty: {
          red: "#dc2626",
          blue: "#2563eb",
          yellow: "#eab308",
          green: "#16a34a",
          black: "#000000",
          white: "#ffffff",
        },
        subtle: {
          "concrete-gray": "rgba(120, 120, 120, 0.15)",
          "whisper-red": "rgba(204, 51, 51, 0.12)",
          "steel-blue": "rgba(70, 130, 180, 0.18)",
          "warm-dust": "rgba(160, 140, 120, 0.10)",
          "faded-yellow": "rgba(255, 204, 0, 0.08)",
          "charcoal-mist": "rgba(54, 54, 54, 0.20)",
          "sage-concrete": "rgba(130, 140, 120, 0.14)",
          "ivory-shadow": "rgba(250, 250, 240, 0.25)",
          "rust-whisper": "rgba(180, 100, 70, 0.11)",
          "cool-slate": "rgba(100, 110, 120, 0.16)",
        },
      },
      // Add custom shadows for brutalist design
      boxShadow: {
        brutal: "8px 8px 0px 0px #000000",
        "brutal-white": "8px 8px 0px 0px #ffffff",
        "brutal-sm": "4px 4px 0px 0px #000000",
        "brutal-lg": "12px 12px 0px 0px #000000",
      },
      // Add custom border widths
      borderWidth: {
        "6": "6px",
        "8": "8px",
        "12": "12px",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        // Enhanced bounce animation for mascot
        "bounce-gentle": {
          "0%, 100%": {
            transform: "translateY(0px)",
            animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)",
          },
          "50%": {
            transform: "translateY(-5px)",
            animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
          },
        },
        // Floating animation for background elements
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "33%": { transform: "translateY(-10px) rotate(1deg)" },
          "66%": { transform: "translateY(5px) rotate(-1deg)" },
        },
        // Pulse animation for interactive elements
        "pulse-gentle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        // New animations
        "bounce-gentle": "bounce-gentle 3s infinite",
        float: "float 6s ease-in-out infinite",
        "pulse-gentle": "pulse-gentle 2s ease-in-out infinite",
      },
      // Add drop shadow utilities
      dropShadow: {
        brutal: "4px 4px 0px rgba(0, 0, 0, 1)",
        "brutal-lg": "8px 8px 0px rgba(0, 0, 0, 1)",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography")
  ],
}
export default config
