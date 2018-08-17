const path = require('path')

let presets = {
  "presets": [
  ],
}

// babel-runtime transform plugin is not needed for production/published code.

let plugins = {
  "plugins": [
    /* Syntax */
    require.resolve(`@babel/plugin-syntax-dynamic-import`),
    // require.resolve(`@babel/plugin-syntax-decorators`),
    /* Transform */
    require.resolve(`@babel/plugin-transform-modules-commonjs`),  // transform static import
    require.resolve(`babel-plugin-dynamic-import-node`), // transform dynamic import
    [ require.resolve(`@babel/plugin-proposal-decorators`), { "legacy": true } ], // https://github.com/babel/babel/issues/7786
    [ require.resolve(`@babel/plugin-proposal-class-properties`), { "loose" : true } ], // static class parameter
    require.resolve(`babel-plugin-transform-function-parameter-decorators`), // function parameter decorator
  ],
}

module.exports = Object.assign({
    // When a file path matches this regex then it is **not** compiled
    "ignore": [/node_modules\/(?!appscript)/] // ignore everythng in node_modules except internal modules.
  },
  presets,
  plugins
)