/** @type {import('tailwindcss').Config} */
export default {
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
      colors: {
        primary: {
          50: '#fbf7fc',
          100: '#f8eef9',
          200: '#f0dcf2',
          300: '#e4c0e7',
          400: '#d59ad8',
          500: '#bb67bf',
          600: '#a453a6',
          700: '#894289',
          800: '#713771',
          900: '#5e315d',
          950: '#3b173a',
        },
      },
    },
  },
  plugins: [],
  important: true,
};
