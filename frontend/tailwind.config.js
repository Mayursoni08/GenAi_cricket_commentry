/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        serif: ['"Bodoni+Moda"', 'Bodoni Moda', 'serif'],
      },
      colors: {
        sports: {
          orange: "#FF8C42",
          deepOrange: "#FF6B35",
          red: "#E63946",
          yellow: "#FFC857",
          white: "#FFFFFF",
          cream: "#FFF7F0",
          navy: "#1D3557",
        }
      },
      boxShadow: {
        'premium': '0 20px 40px -15px rgba(29, 53, 87, 0.06)',
        'premium-hover': '0 30px 60px -20px rgba(255, 107, 53, 0.18)',
        'glass': '0 8px 32px 0 rgba(29, 53, 87, 0.04)',
      }
    },
  },
  plugins: [],
}
