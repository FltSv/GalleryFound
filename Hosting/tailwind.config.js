/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        magneto: ['"magneto"', 'sans-serif'],
        yojo: ['yojo'],
        comesinhandy: ['comesinhandy'],
      },
    },
  },
  plugins: [],
};
