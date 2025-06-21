/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      colors: {
        vibe: {
          happy: "#22c55e",
          productive: "#3b82f6",
          tired: "#f59e0b",
          excited: "#ec4899",
          stressed: "#ef4444",
          calm: "#8b5cf6",
          creative: "#06b6d4",
          focused: "#10b981",
          anxious: "#f97316",
          grateful: "#84cc16",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
