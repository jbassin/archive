module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        eczar: ['Eczar'],
        changa: ['Changa One'],
        dm: ['DM Serif Text'],
        gelasio: ['Gelasio'],
        roboto: ['Roboto Condensed'],
        tauri: ['Tauri'],
        teko: ['Teko'],
      },
      colors: {
        background: {
          400: '#F3F1EB',
          500: '#F2EFE9',
          600: '#E0D9CB',
          700: '#DBD0BC',
          900: '#C9CCC2',
        },
        crimson: {
          500: '#58180D',
        },
      },
    },
  },
  plugins: [require('tailwindcss-opentype')],
};
