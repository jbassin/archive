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
        background: '#F2EFE9',
        crimson: {
          500: '#58180D',
        },
      },
    },
  },
  plugins: [],
};
