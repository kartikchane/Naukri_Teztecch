/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00C2A8',      // Teztecch Teal
        secondary: '#00A896',    // Darker Teal
        accent: '#FF6B35',       // Teztecch Orange
        'teztecch-teal': '#00CED1',
        'teztecch-dark': '#1a1a1a',
        'teztecch-gray': '#f5f5f5',
      },
      fontFamily: {
        'sans': ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
        'heading': ['Montserrat', 'Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
