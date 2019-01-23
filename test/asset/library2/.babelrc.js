console.log(".babelrc for library2")

const path = require('path'),
      replaceText = require('../babelPlugin/replaceText.js')

let presets = {
  "presets": [],
}

let plugins = {
  "plugins": [
    replaceText('cat-emoji', '😺'),
  ],
}

module.exports = Object.assign({
  },
  presets,
  plugins
)