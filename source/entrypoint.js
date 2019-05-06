// babel JS Compiler - This file should be written in native ES
// .babelrc doesn't have a way to specify path.

const path = require('path'),
  filesystem = require('fs'),
  assert = require('assert'),
  moduleSystem = require('module'),
  EventEmitter = require('events'),
  babelRegister = require(`@babel/register`),
  { addHook: addRequireHook } = require('pirates'),
  { addModuleResolutionPathMultiple } = require(`@dependency/addModuleResolutionPath`),
  { filesystemTranspiledOutput } = require('./additionalRequireHook.js'),
  { requireHook: defaultRequireHookConfig } = require('./compilerConfiguration/requireHookConfig.js'),
  { isPreservedSymlinkFlag } = require('./utility/isPreservedSymlinkFlag.js')
// let findTargetProjectRoot // possible circular dependency.

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
    function requireHook({ babelTransformConfig, babelRegisterConfig }) {
      // console.group(`\x1b[2m\x1b[3m• Babel:\x1b[0m Compiling code at runtime.`)
      // The require hook will bind itself to node's require and automatically compile files on the fly
      babelRegister(Object.assign({}, babelTransformConfig, babelRegisterConfig)) // Compile code on runtime.
      // console.groupEnd()
    }
    let revertHook = requireHook({ babelTransformConfig: this.babelTransformConfig, babelRegisterConfig: this.babelRegisterConfig })
    this.trackLoadedFile()
    return {
      revertHook: revertHook,
    }
  }
  trackLoadedFile() {
    debugger
    this.loadedFiles = this.loadedFiles || []
    let ignoreFilenamePattern = []
    let eventEmitter = new EventEmitter()
    addRequireHook(
      (code, filename) => {
        eventEmitter.emit('fileLoaded', { filename, code })
        return code // pass to next registered hook without changes.
      },
      {
        exts: this.babelRegisterConfig.extensions,
        ignoreNodeModules: true,
        matcher: filename => (ignoreFilenamePattern.some(regex => filename.match(regex)) ? false : true),
      },
    )
    eventEmitter.on('fileLoaded', fileObject => this.loadedFiles.push({ ...fileObject }))
    return eventEmitter
  }
  outputTranspilation() {
    this.setTargetProject()
    // output transpilation result into filesystem files
    return filesystemTranspiledOutput({
      babelConfig: this.babelTransformConfig,
      extension: this.babelRegisterConfig.extensions,
      ignoreFilenamePattern: this.babelRegisterConfig.ignore,
      shouldTransform: false,
      targetProjectConfig: this.targetProjectConfig,
    })
  }
  setTargetProject() {
    const { findTargetProjectRoot } = require('@dependency/configurationManagement') // require here to prevent cyclic dependency with this module, as the module may use runtime transpilation (i.e. will use exported functionality from this module).
    if (!this.targetProjectConfig) this.targetProjectConfig = findTargetProjectRoot({ nestedProjectPath: [process.cwd(), module.parent.filename /* The place where the module was required from */] })
  }
}

// initialize - register Node Module Resolution Path
;(function() {
  const babelModulesPath = path.dirname(path.dirname(path.dirname(require.resolve('@babel/core/package.json')))) // get the node_modules folder where Babel plugins are installed. Could be own package root or parent packages root (when this modules is installed as a pacakge)
  addModuleResolutionPathMultiple({ pathArray: [babelModulesPath] }) // Add babel node_modules to module resolving paths
})()
/**
 * export before importing possible circular dependencies.
 * export ecmascript specification complient modules allow circular module dependencyز
 */
Object.assign(module.exports, { Compiler, getBabelConfig, getCompilerConfig })
if (isPreservedSymlinkFlag())
  throw new Error(
    '• Using `preserve symlink` node runtime flag will cause infinite circular dependency, where each will load the module with different accumulative path when symlinking node_modules to each other.',
  )
// ;({ findTargetProjectRoot } = require('@dependency/configurationManagement')) // require here to prevent cyclic dependency with this module, as the module may use runtime transpilation (i.e. will use exported functionality from this module).
