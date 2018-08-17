const path = require('path')

let presets = {
  "presets": [],
}

// TODO: cannot use "plugin-syntax-decorators" with "plugin-transform-function-parameter-decorators" - in compatible with babel 7 beta 47
let plugins = {
  "plugins": [
    /* Syntax */
    require.resolve('@babel/plugin-syntax-dynamic-import'),
    // require.resolve(`@babel/plugin-syntax-decorators`),
    /* Runtime */
    require.resolve(`@babel/plugin-transform-runtime`), // runtime required
    /* Transform */
    require.resolve(`@babel/plugin-transform-modules-commonjs`),  // transform static import
    require.resolve(`babel-plugin-dynamic-import-node`), // transform dynamic import
    [ require.resolve(`@babel/plugin-proposal-decorators`), { "legacy": true } ], // transform decorators - // https://github.com/babel/babel/issues/7786
    [ require.resolve(`@babel/plugin-proposal-class-properties`), { "loose" : true } ], // transform static class parameter
    require.resolve(`babel-plugin-transform-function-parameter-decorators`), // function parameter decorator
  ],
}

module.exports = Object.assign({
    // When a file path matches this regex then it is **not** compiled
    "ignore": [/node_modules\/(?!appscript)/], // ignore everythng in node_modules except internal modules.
    // Setting this will remove the currently hooked extensions of `.es6`, `.es`, `.jsx`, `.mjs`
    // and .js so you'll have to add them back if you want them to be used again.
    extensions: [".js", ".mjs"], // default is ".es6", ".es", ".jsx", ".js", ".mjs"
  },
  presets,
  plugins
)