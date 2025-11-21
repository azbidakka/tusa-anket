/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0A6A39',
        'primary-dark': '#084F2A',
        accent: '#1E7D4E',
        'bg-light': '#F8FAFC',
        border: '#E5E7EB',
        'text-dark': '#0B1320'
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif']
      },
      borderRadius: {
        'button': '12px'
      }
    }
  },
  plugins: []
};
