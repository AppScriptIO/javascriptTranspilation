// babel JS Compiler - This file should be written in native ES
// .babelrc doesn't have a way to specify path.

const path = require('path'),
  filesystem = require('fs'),
  assert = require('assert'),
  moduleSystem = require('module'),
  { addModuleResolutionPathMultiple } = require(`@dependency/addModuleResolutionPath`),
  babelRegister = require(`@babel/register`),
  { filesystemTranspiledOutput } = require('./transpiledOutput.js'),
  { requireHook: defaultRequireHookConfig } = require('./compilerConfiguration/requireHookConfig.js')

let findTargetProjectRoot // possible circular dependency.

function registerNodeModuleResolution() {
  const babelModulesPath = path.dirname(path.dirname(path.dirname(require.resolve('@babel/core/package.json')))) // get the node_modules folder where Babel plugins are installed. Could be own package root or parent packages root (when this modules is installed as a pacakge)
  addModuleResolutionPathMultiple({ pathArray: [babelModulesPath] }) // Add babel node_modules to module resolving paths
}

// Compiler configuration includes `babel transform` options & `@babel/register` configuration.
function getCompilerConfig(configKey) {
  return require(`./compilerConfiguration/${configKey}`) // load configuration equivalent to .babelrc options
}

// export babel configuratio sets as well
function getBabelConfig(babelConfigFilename, { configType = 'json' } = {}) {
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

function requireHook({ babelTransformConfig, babelRegisterConfig }) {
  // console.group(`\x1b[2m\x1b[3m• Babel:\x1b[0m Compiling code at runtime.`)
  // The require hook will bind itself to node's require and automatically compile files on the fly
  babelRegister(Object.assign({}, babelTransformConfig, babelRegisterConfig)) // Compile code on runtime.
  // console.groupEnd()
}

function outputTranspilation({ babelTransformConfig, babelRegisterConfig, targetProjectConfig }) {
  // output transpilation result into filesystem files
  filesystemTranspiledOutput({
    babelConfig: babelTransformConfig,
    extension: babelRegisterConfig.extensions,
    ignoreFilenamePattern: babelRegisterConfig.ignore,
    shouldTransform: false,
    targetProjectConfig,
  })
}

/**
 * Used to initialize nodejs app with transpiled code using Babel, through an entrypoint.js which loads the app.js
 */
class Compiler {
  constructor({ babelTransformConfig, babelRegisterConfig } = {}) {
    if (!babelRegisterConfig) babelRegisterConfig = defaultRequireHookConfig
    if (!babelTransformConfig) {
      this.setTargetProject()
      babelTransformConfig = this.targetProjectConfig.configuration.transpilation.babelConfig
    }
    this.babelTransformConfig = babelTransformConfig
    this.babelRegisterConfig = babelRegisterConfig
  }
  requireHook() {
    return requireHook({ babelTransformConfig: this.babelTransformConfig, babelRegisterConfig: this.babelRegisterConfig })
  }
  outputTranspilation() {
    this.setTargetProject()
    return outputTranspilation({ babelTransformConfig: this.babelTransformConfig, babelRegisterConfig: this.babelRegisterConfig, targetProjectConfig: this.targetProjectConfig })
  }
  setTargetProject() {
    if (!this.targetProjectConfig) this.targetProjectConfig = findTargetProjectRoot({ nestedProjectPath: [process.cwd(), module.parent.filename /* The place where the module was required from */] })
  }
}

// initialize
registerNodeModuleResolution()
/**
 * export before importing possible circular dependencies.
 * export ecmascript specification complient modules allow circular module dependencyز
 */
Object.assign(module.exports, { Compiler, getBabelConfig, getCompilerConfig })
;({ findTargetProjectRoot } = require('@dependency/configurationManagement')) // require here to prevent cyclic dependency with this module, as the module may use runtime transpilation (i.e. will use exported functionality from this module).
