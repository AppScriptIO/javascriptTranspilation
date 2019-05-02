// babel JS Compiler - This file should be written in native ES
// .babelrc doesn't have a way to specify path.

const path = require('path'),
  filesystem = require('fs'),
  moduleSystem = require('module'),
  { addModuleResolutionPathMultiple } = require(`@dependency/addModuleResolutionPath`),
  babelRegister = require(`@babel/register`),
  { filesystemTranspiledOutput } = require('./transpiledOutput.js'),
  assert = require('assert')

/**
 * Used to initialize nodejs app with transpiled code using Babel, through an entrypoint.js which loads the app.js
 */
function babelJSCompiler({
  babelConfigurationFile, // {string} file containing bable configurations to be used.
  outputTranspilation = false,
}) {
  if (!shouldCompile()) return

  const babelModulesPath = path.dirname(path.dirname(path.dirname(require.resolve('@babel/core/package.json')))) // get the node_modules folder where Babel plugins are installed. Could be own package root or parent packages root (when this modules is installed as a pacakge)
  addModuleResolutionPathMultiple({ pathArray: [babelModulesPath] }) // Add babel node_modules to module resolving paths

  const babelConfiguration = require(`./compilerConfiguration/${babelConfigurationFile}`) // load configuration equivalent to .babelrc options.

  // add babel register configuration to the babel config object.
  const babelRegisterConfiguration = Object.assign({}, babelConfiguration.registerConfig, babelConfiguration.babelConfig)
  // console.group(`\x1b[2m\x1b[3m• Babel:\x1b[0m Compiling code at runtime.`)
  // The require hook will bind itself to node's require and automatically compile files on the fly
  babelRegister(babelRegisterConfiguration) // Compile code on runtime.
  // console.groupEnd()

  // output transpilation result into filesystem files
  if (outputTranspilation)
    filesystemTranspiledOutput({
      babelConfig: babelConfiguration.babelConfig,
      extension: babelConfiguration.registerConfig.extensions,
      ignoreFilenamePattern: babelConfiguration.registerConfig.ignore,
      pathRequiredFrom: [process.cwd(), module.parent.filename],
      shouldTransform: false,
    })
}

function shouldCompile() {
  // TODO: (if necessary) check if `babel` is already hooked the require module.

  return true
}

// export babel configuratio sets as well
babelJSCompiler.getBabelConfig = (babelConfigFilename, { configType = 'json' } = {}) => {
  const jsonConfig = require(`./compilerConfiguration/${babelConfigFilename}`)
  switch (configType) {
    case 'functionApi':
      return api => {
        api.cache.forever()
        return jsonConfig.babelConfig
      }
      break
    case 'json':
    default:
      return jsonConfig.babelConfig
      break
  }
  return
}

module.exports = babelJSCompiler
