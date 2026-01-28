import { type Config } from "tailwindcss";
import { heroui } from "@heroui/react";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                nexus: {
                    dark: "#020617", // Slate 950
                    glass: "rgba(15, 23, 42, 0.6)", // Slate 900 / 60%
                    neonBlue: "#00f0ff",
                    neonRed: "#ff003c",
                    safe: "#00ff9d",
                }
            },
            fontFamily: {
                mono: ["var(--font-geist-mono)"],
                sans: ["var(--font-inter)"],
            },
            backdropBlur: {
                xs: '2px',
            }
        },
    },
    darkMode: "class",
    plugins: [heroui()],
};

export default config;
