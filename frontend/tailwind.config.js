/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4285F4",
        primaryLight: "#E8F0FE",
        primaryDark: "#3367D6",
        secondary: "#34A853",
        secondaryLight: "#E6F4EA",
        secondaryDark: "#2D8E4A",
        accent: "#FBBC05",
        accentLight: "#FEF7E0",
        accentDark: "#F9AB00",
        danger: "#EA4335",
        dangerLight: "#FCE8E6",
        dangerDark: "#D33426",
      },
      animation: {
        'fade-in': 'fadeIn 0.4s',
        'fade-in-up': 'fadeInUp 0.4s',
        'bounce-in': 'bounceIn 0.5s',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'none' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.95)' },
          '60%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}