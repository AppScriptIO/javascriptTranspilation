import path from 'path'
import { transformNamedModuleToPath, minifyHtmlTemplateLiterals } from '../utility/transformPlugin.babel.js'
import babelPresetMinifyConfig from './babelPresetMinifyModuleConfig.preset.js'

// https://github.com/open-wc/open-wc/blob/master/packages/es-dev-server/src/utils/babel-transform.js
module.exports = {
  babelConfig: {
    presets: [babelPresetMinifyConfig],
    plugins: [
      /* Syntax */
      require.resolve(`@babel/plugin-syntax-dynamic-import`),
      require.resolve(`@babel/plugin-syntax-import-meta`),
      require.resolve('@babel/plugin-syntax-numeric-separator'),
      // require.resolve(`@babel/plugin-syntax-decorators`),
      /* Transform */
      // @babel/plugin-syntax-class-properties
      [require.resolve(`@babel/plugin-proposal-decorators`), { legacy: true }], // https://github.com/babel/babel/issues/7786
      [require.resolve(`@babel/plugin-proposal-class-properties`), { loose: true }],
      transformNamedModuleToPath,
      // minifyHtmlTemplateLiterals // TODO: transform tagged template literals in js files (minify).
    ],
  },
}

