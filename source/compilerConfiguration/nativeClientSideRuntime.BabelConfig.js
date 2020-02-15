const path = require('path')
const { transformNamedModuleToPath, minifyHtmlTemplateLiterals } = require('../transformPlugin.babel.js')
const babelPresetMinifyConfig = require('./babelPresetMinifyModuleConfig.preset.js')

// https://github.com/open-wc/open-wc/blob/master/packages/es-dev-server/src/utils/babel-transform.js
module.exports = {
  babelConfig: {
    // TODO: fix - minification breaks code.
    // presets: [babelPresetMinifyConfig],
    plugins: [
      // TODO: use target presets rather than specific plugins list. e.g. current Canary Chrome has support for dynamic imports, therefore no need to use any plugins for them.
      /* Syntax */
      // require.resolve(`@babel/plugin-syntax-dynamic-import`),
      // require.resolve(`@babel/plugin-syntax-import-meta`),
      // require.resolve('@babel/plugin-syntax-numeric-separator'),
      // require.resolve(`@babel/plugin-syntax-decorators`),
      /* Transform */
      // @babel/plugin-syntax-class-properties
      // [require.resolve(`@babel/plugin-proposal-decorators`), { legacy: true }], // https://github.com/babel/babel/issues/7786
      // [require.resolve(`@babel/plugin-proposal-class-properties`), { loose: true }],

      // minifyHtmlTemplateLiterals // TODO: transform tagged template literals in js files (minify).

      /* Resolve named module path / Bare imports: */
      transformNamedModuleToPath,
      // [
      //   // Doesn't work, seems for intended use in nodejs environment javascript. Not browser side javascript.
      //   require.resolve('babel-plugin-module-resolver'),
      //   {
      //     root: ['./@package'],
      //     alias: {
      //       test: './test',
      //     },
      //   },
      // ],
    ],
  },
}
