console.log('babel.config.js')

const path = require('path'),
      replaceText = require('./asset/babelPlugin/replaceText.js')

let presets = []

let plugins = [
    replaceText('dog-emoji', '🐶'),
    replaceText('cat-emoji', '😺'),
    // require.resolve(`babel-plugin-macros`)

]

module.exports = function(api) {
  api.cache(false);
  return {
    plugins,
    presets,
  }
}