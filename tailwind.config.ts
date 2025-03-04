import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        jejumyeongjo: ["JejuMyeongjo", "serif"],
        roadrage: ["Road Rage", "serif"],
        roboto: ["Roboto", "serif"],
      },
      colors: {
        background: {
          DEFAULT: "#041E23",
          primary: "#08252B",
          secondary: "#02191D",
          tertiary: "#052228",
        },
        stroke: {
          DEFAULT: "#0E464F",
          primary: "#07373F",
        },
        blue: {
          DEFAULT: "#24A0B5",
          primary: "#197686",
        },
        white: "#FFFFFF",
        grey: "#FAFAFA",
      },
      backgroundImage: {
        "radial-blue": "radial-gradient(circle, #24A0B5/20%, #24A0B5)",
        "radial-combo":
          "radial-gradient(circle, rgba(36,160,181,0.2), #24a0b5), #02191d",
      },
    },
  },
  plugins: [],
} satisfies Config;
