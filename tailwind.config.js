module.exports = {
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
  purge: {
    mode: 'all',
    enabled: true,
    content: [
      './src/html/*.html'
    ]
  }
}

