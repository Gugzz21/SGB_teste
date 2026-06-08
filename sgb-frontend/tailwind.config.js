/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sgb-vinho': '#881337', // Vinho/Borgonha
        'sgb-rosa': '#db2777', // Rosa Inclusivo
        'sgb-dourado': '#d97706', // Dourado/Bronze
        'sgb-bg': '#f8fafc', // slate-50
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
