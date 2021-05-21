module.exports = {
  darkMode: false, // or 'media' or 'class'
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
      './src/html/*.html',
      './src/index.js'
    ]
  }
}

