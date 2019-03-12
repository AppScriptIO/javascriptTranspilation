import path from 'path'
import { transformNamedModuleToPath, minifyHtmlTemplateLiterals } from '../utility/transformPlugin.babel.js'
import babelPresetMinifyConfig from './babelPresetMinifyModuleConfig.preset.js'

module.exports = {

  babelConfig: {
    presets: [
      babelPresetMinifyConfig    
    ],
    plugins: [
      /* Syntax */
      require.resolve(`@babel/plugin-syntax-dynamic-import`),
      require.resolve(`@babel/plugin-syntax-import-meta`),
      // require.resolve(`@babel/plugin-syntax-decorators`),
      /* Transform */
      [ require.resolve(`@babel/plugin-proposal-decorators`), { "legacy": true } ], // https://github.com/babel/babel/issues/7786
      [ require.resolve(`@babel/plugin-proposal-class-properties`), { "loose" : true } ],
      transformNamedModuleToPath,
      // minifyHtmlTemplateLiterals // TODO: transform tagged template literals in js files (minify).
    ]
  },

  registerConfig: {
    // When a file path matches this regex then it is **not** compiled
    "ignore": [/node_modules\/(?!appscript)/] // ignore everythng in node_modules except internal modules.
  }

}