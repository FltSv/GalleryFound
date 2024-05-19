/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        magneto: ['magneto'],
        yojo: ['yojo'],
        comesinhandy: ['comesinhandy'],
        ibmflex: ['IBM Plex Sans'],
        redhatdisp: ['Red Hat Display'],
      },
    },
  },
  plugins: [],
  important: true,
};
