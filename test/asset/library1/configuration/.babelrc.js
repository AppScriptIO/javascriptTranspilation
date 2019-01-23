console.log(".babelrc for library1")

const path = require('path'),
      replaceText = require('../../babelPlugin/replaceText.js')

let presets = {
  "presets": [],
}

let plugins = {
  "plugins": [
    replaceText('dog-emoji', '🐶'),
  ],
}

module.exports = Object.assign({
  },
  presets,
  plugins
)