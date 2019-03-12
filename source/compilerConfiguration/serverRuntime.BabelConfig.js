const path = require('path')

module.exports = {

  babelConfig: {
    presets: [
    ],

    // TODO: cannot use "plugin-syntax-decorators" with "plugin-transform-function-parameter-decorators" - in compatible with babel 7 beta 47
    plugins: [
      /* Syntax */
      require.resolve('@babel/plugin-syntax-dynamic-import'),
      // require.resolve(`@babel/plugin-syntax-decorators`),
      /* Runtime */
      require.resolve(`@babel/plugin-transform-runtime`), // runtime required
      /* Typescript - conditionally transforms only typescript files. */
      [ require.resolve('@babel/plugin-transform-typescript'), {}], 
      /* Transform */
      require.resolve(`@babel/plugin-transform-modules-commonjs`),  // transform static import
      require.resolve(`babel-plugin-dynamic-import-node`), // transform dynamic import
      [ require.resolve(`@babel/plugin-proposal-decorators`), { "legacy": true } ], // transform decorators - // https://github.com/babel/babel/issues/7786
      [ require.resolve(`@babel/plugin-proposal-class-properties`), { "loose" : true } ], // transform static class parameter
      require.resolve(`babel-plugin-transform-function-parameter-decorators`), // function parameter decorator
      require.resolve(`@babel/plugin-proposal-function-bind`), // Bind shorthand replaces `.call` & `.bind`
      require.resolve(`@babel/plugin-proposal-function-sent`), // Adds `function.sent` meta propety in generators
    ]
  },

  registerConfig: {
    // When a file path matches this regex then it is **not** compiled
    "ignore": [/node_modules\/(?!@dependency)/], // ignore everythng in node_modules except internal modules.
    // Setting this will remove the currently hooked extensions of `.es6`, `.es`, `.jsx`, `.mjs`
    // and .js so you'll have to add them back if you want them to be used again.
    extensions: [".js", ".mjs", ".ts"], // default is ".es6", ".es", ".jsx", ".js", ".mjs"    
  }

}