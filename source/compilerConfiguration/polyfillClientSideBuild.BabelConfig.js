const path = require('path')
const { transformNamedModuleToPath, minifyHtmlTemplateLiterals } = require('../utility/transformPlugin.babel.js')
const babelPresetMinifyConfig = require('./babelPresetMinifyModuleConfig.preset.js')

module.exports = {
  babelConfig: {
    // TODO: fix polyfill - add polyfill for native import, es2015 currently causes errors, etc.
    presets: [
      [
        require.resolve(`@babel/preset-env`), // https://babeljs.io/docs/en/usage  // https://babeljs.io/docs/en/babel-preset-env
        {
          targets: {
            chrome: '49',
            opera: '36',
            ie: '11',
            edge: '15',
            firefox: '51',
            safari: '10',
          },
          // useBuiltIns: 'usage',
        },
      ],
      babelPresetMinifyConfig,
      // require.resolve(`@babel/preset-stage-0`),
    ],
    plugins: [
      require.resolve(`@babel/plugin-syntax-dynamic-import`),
      require.resolve(`@babel/plugin-syntax-import-meta`),
      // require.resolve(`@babel/plugin-syntax-decorators`),
      [require.resolve(`@babel/plugin-proposal-decorators`), { legacy: true }], // https://github.com/babel/babel/issues/7786
      [require.resolve(`@babel/plugin-proposal-class-properties`), { loose: true }],
      transformNamedModuleToPath,
      // minifyHtmlTemplateLiterals // TODO: transform tagged template literals in js files (minify).
    ],
  },
}

// https://github.com/open-wc/open-wc/blob/master/packages/es-dev-server/src/utils/babel-transform.js
// require.resolve('@babel/plugin-proposal-dynamic-import'),
// require.resolve('@babel/plugin-transform-modules-systemjs'),
// // systemjs adds template literals, we do systemjs after (potential)
// // es5 compilation so we need to ensure it stays es5
// require.resolve('@babel/plugin-transform-template-literals'),
