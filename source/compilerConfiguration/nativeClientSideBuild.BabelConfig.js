const path = require('path')
const { transformNamedModuleToPath, minifyHtmlTemplateLiterals } = require('../transformPlugin.babel.js')
const babelPresetMinifyConfig = require('./babelPresetMinifyModuleConfig.preset.js')

// TODO: use `https://www.npmjs.com/package/minify-html-literals` to minify javascript template literals e.g. let x = html`<tag>  </tag>`
module.exports = {
  babelConfig: {
    presets: [babelPresetMinifyConfig],
    plugins: [
      /* Syntax */
      require.resolve(`@babel/plugin-syntax-dynamic-import`),
      require.resolve(`@babel/plugin-syntax-import-meta`),
      // require.resolve(`@babel/plugin-syntax-decorators`),
      /* Transform */
      [require.resolve(`@babel/plugin-proposal-decorators`), { legacy: true }], // https://github.com/babel/babel/issues/7786
      [require.resolve(`@babel/plugin-proposal-class-properties`), { loose: true }],
      transformNamedModuleToPath,
      // minifyHtmlTemplateLiterals // TODO: transform tagged template literals in js files (minify).

      // test transforming commonjs clientside library to native es modules (adding exports and removing encapsulating scope.)
      // require.resolve(`babel-plugin-transform-commonjs-es2015-modules`),
    ],
  },
}
