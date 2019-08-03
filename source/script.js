// babel JS Compiler - This file should be written in native ES
// .babelrc doesn't have a way to specify path.

const path = require('path'),
  filesystem = require('fs'),
  assert = require('assert'),
  moduleSystem = require('module'),
  EventEmitter = require('events'),
  babelRegister = require(`@babel/register`),
  { addHook: addRequireHook } = require('pirates')
// let findTargetProjectRoot // possible circular dependency.

// Requiring module's path.
const targetProjectCallerPath = module.parent.parent.filename // first parent module is the entrypoint `index.js`, second is the module that calls the require hook.

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

// Early export of necessary modules to allow nested dependencies or circular dependencies to use the independent exports.
module.exports.getBabelConfig = getBabelConfig
module.exports.getCompilerConfig = getCompilerConfig
const { addModuleResolutionPathMultiple } = require(`@dependency/addModuleResolutionPath`),
  { filesystemTranspiledOutput } = require('./additionalRequireHook.js'),
  defaultRequireHookConfig = require('./compilerConfiguration/requireHookConfig.js'),
  { isPreservedSymlinkFlag } = require('./utility/isPreservedSymlinkFlag.js')

/**
 * Used to initialize nodejs app with transpiled code using Babel, through an entrypoint.js which loads the app.js after registering the transpilation require hooks.
 */
class Compiler {
  constructor({ babelTransformConfig, babelRegisterConfig, callerPath, debugKey } = {}) {
    if (!babelRegisterConfig) babelRegisterConfig = defaultRequireHookConfig()
    if (!babelTransformConfig) {
      assert(callerPath, '• callerPath should be passed in case babel configuration was not provided')
      this.setTargetProject({ nestedProjectPath: [callerPath] })
      babelTransformConfig = this.targetProjectConfig.configuration.transpilation.babelConfig
    }
    if (!debugKey) debugKey = callerPath
    this.debugKey = debugKey
    this.callerPath = callerPath
    this.babelTransformConfig = babelTransformConfig
    this.babelRegisterConfig = babelRegisterConfig
  }
  requireHook({
    restrictToTargetProject = true, // this option when false allows circular dependency `configurationManagement` to use transpilation.
  } = {}) {
    function requireHook({ babelTransformConfig, babelRegisterConfig }) {
      // console.group(`\x1b[2m\x1b[3m• Babel:\x1b[0m Compiling code at runtime.`)
      // The require hook will bind itself to node's require and automatically compile files on the fly
      babelRegister(Object.assign({}, babelTransformConfig, babelRegisterConfig)) // Compile code on runtime.
      // console.groupEnd()
    }
    if (restrictToTargetProject) {
      assert(this.callerPath, '• callerPath should be passed in order to lookup for project configuration.')
      this.setTargetProject({ nestedProjectPath: [this.callerPath] })
      const targetProjectFilesRegex = new RegExp(`^((?!${this.targetProjectConfig.rootPath}).)*$`) // negation - paths that don't include the path i.e. outside the directory.
      this.babelRegisterConfig.ignore.push(targetProjectFilesRegex) // transpile files that are nested in the target project only.
    }
    let revertHook = requireHook({ babelTransformConfig: this.babelTransformConfig, babelRegisterConfig: this.babelRegisterConfig })
    Compiler.trackRegisteredHook() // keep track of all projects that initiated a require hook registration.
    this.trackLoadedFile()
    this.outputTranspilation()
    return { revertHook: revertHook }
  }
  /** Usage: 
     ```
      process.on('exit', () => {
        console.log(compiler.loadedFiles.map(value => value.filename))
        console.log(compiler.babelRegisterConfig.ignore)
      })
    ```
   */
  trackLoadedFile() {
    this.loadedFiles = this.loadedFiles || []
    let ignoreFilenamePattern = this.babelRegisterConfig.ignore
    let eventEmitter = new EventEmitter()
    addRequireHook(
      (code, filename) => {
        eventEmitter.emit('fileLoaded', { filename, code })
        return code // pass to next registered hook without changes.
      },
      {
        exts: this.babelRegisterConfig.extensions,
        ignoreNodeModules: false,
        matcher: filename => (ignoreFilenamePattern.some(regex => filename.match(regex)) ? false : true),
      },
    )
    eventEmitter.on('fileLoaded', fileObject => this.loadedFiles.push({ ...fileObject }))
    return eventEmitter
  }
  outputTranspilation() {
    this.setPrimaryTargetProject()
    // output transpilation result into filesystem files
    return filesystemTranspiledOutput({
      babelConfig: this.babelTransformConfig,
      extension: this.babelRegisterConfig.extensions,
      ignoreFilenamePattern: this.babelRegisterConfig.ignore,
      shouldTransform: false,
      targetProjectConfig: this.primaryTargetProjectConfig,
    })
  }
  setTargetProject({ nestedProjectPath = [] }) {
    if (this.targetProjectConfig) return
    const { findTargetProjectRoot } = require('@dependency/configurationManagement') // require here to prevent cyclic dependency with this module, as the module may use runtime transpilation (i.e. will use exported functionality from this module).
    this.targetProjectConfig = findTargetProjectRoot({ nestedProjectPath })
  }
  // main target project that initiated the node process from cli or require the module before being cached, in cases where node_modules are also transpiled.
  setPrimaryTargetProject({ nestedProjectPath = [process.cwd(), module.parent.filename /* The place where the module was required from */] } = {}) {
    if (this.primaryTargetProjectConfig) return
    const { findTargetProjectRoot } = require('@dependency/configurationManagement') // require here to prevent cyclic dependency with this module, as the module may use runtime transpilation (i.e. will use exported functionality from this module).
    this.primaryTargetProjectConfig = findTargetProjectRoot({ nestedProjectPath })
  }
}

// register the modules that registered a require hook for compilation.
Compiler.registeredHook = [] // initialize property.
Compiler.trackRegisteredHook = function() {
  Compiler.registeredHook.push(targetProjectCallerPath)
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
Object.assign(module.exports, { Compiler })
if (isPreservedSymlinkFlag())
  throw new Error(
    '• Using `preserve symlink` node runtime flag will cause infinite circular dependency, where each will load the module with different accumulative path when symlinking node_modules to each other.',
  )
// ;({ findTargetProjectRoot } = require('@dependency/configurationManagement')) // require here to prevent cyclic dependency with this module, as the module may use runtime transpilation (i.e. will use exported functionality from this module).
