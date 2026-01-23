/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6', // Neon Blue
          glow: '#38BDF8',
          hover: '#2563EB',
        },
        base: {
          dark: '#05060A', // Near Black
          navy: '#0B1220', // Dark Navy
          card: 'rgba(11, 18, 32, 0.6)',
        },
        accent: {
          purple: '#A855F7', // Electric Purple
          cyan: '#06b6d4',
        }
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, #1f2937 1px, transparent 1px), linear-gradient(to bottom, #1f2937 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
}
