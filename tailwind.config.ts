import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        klozui: {
          // green: "#34C759",
          // deepgreen: "#1F7A34",
          // orange: "#FF9500",
          // darkgreen: "#165228",
          // light: "#FFFFFF",
          // dark: "#333333",
          green: {
            50: "#f0e7fd",
            100: "#dac2fa",
            200: "#bc94f4",
            300: "#9d66ee",
            400: "#8038e8",
            500: "#6e2dd2", // updated base color
            600: "#5823a8",
            700: "#431b7e",
            800: "#2d1254",
            900: "#180a2a",
          },

          deepgreen: {
            50: "#E6F0E9",
            100: "#CCE1D3",
            200: "#99C3A7",
            300: "#66A57B",
            400: "#33874F",
            500: "#1F7A34", // base color
            600: "#19622A",
            700: "#134920",
            800: "#0C3116",
            900: "#06180B",
          },
          orange: {
            50: "#f5fbe7",
            100: "#e9f7ce",
            200: "#d3ef9e",
            300: "#bce76d",
            400: "#a6df3d",
            500: "#91D22D", // base color
            600: "#74a823",
            700: "#577e1a",
            800: "#3a5411",
            900: "#1d2a07",
          },
          darkgreen: {
            50: "#E5E9E6",
            100: "#CBD3CE",
            200: "#97A79C",
            300: "#637B6B",
            400: "#2F4F39",
            500: "#165228", // base color
            600: "#124220",
            700: "#0E3118",
            800: "#0A2110",
            900: "#051008",
          },
          light: {
            50: "#FFFFFF", // base color
            100: "#FCFCFC",
            200: "#F8F8F8",
            300: "#F5F5F5",
            400: "#F2F2F2",
            500: "#EEEEEE",
            600: "#E5E5E5",
            700: "#DBDBDB",
            800: "#D2D2D2",
            900: "#C8C8C8",
          },
          dark: {
            50: "#F5F5F5",
            100: "#EBEBEB",
            200: "#D6D6D6",
            300: "#C2C2C2",
            400: "#ADADAD",
            500: "#999999",
            600: "#666666",
            700: "#4D4D4D",
            800: "#333333", // base color
            900: "#1A1A1A",
          },
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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
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
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "slide-in": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "ping-slow": {
          "0%": { transform: "scale(1)", opacity: "1" },
          "75%": { transform: "scale(1.25)", opacity: "0.5" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "scale-in": "scale-in 0.3s ease-out forwards",
        "slide-in": "slide-in 0.3s ease-out forwards",
        "slide-up": "slide-up 0.3s ease-out forwards",
        "ping-slow": "ping-slow 2s ease-in-out infinite",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
