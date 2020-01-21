const path = require('path'),
  filesystem = require('fs'),
  assert = require('assert'),
  EventEmitter = require('events'),
  { filesystemTranspiledOutput, runtimeTransformHook, requireHookUsingBabelRegister } = require('./requireHook.js'),
  { defaultRequireHookConfig } = require('./getConfig.js')

/**
 * Used to initialize nodejs app with transpiled code using Babel, through an entrypoint.js which loads the app.js after registering the transpilation require hooks.
 */
class Compiler extends EventEmitter {
  constructor({ babelTransformConfig, babelRegisterConfig, callerPath, debugKey } = {}) {
    super()
    Compiler.instance.push(this) // track instances

    if (!babelRegisterConfig) babelRegisterConfig = defaultRequireHookConfig
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

    /** Usage: 
      ```
        process.on('exit', () => {
          console.log(compiler.loadedFiles.map(value => value.filename))
          console.log(compiler.babelRegisterConfig.ignore)
        })
      ```
      */
    this.loadedFiles = this.loadedFiles || []
  }

  requireHook({
    restrictToTargetProject = true, // this option when false allows circular dependency `configurationManagement` to use transpilation.
    matchTargetFile = true, // use passed babel config ignore globs and regex to match files and filter the files to transpile.
  } = {}) {
    if (!matchTargetFile) this.babelRegisterConfig.ignore = []
    if (restrictToTargetProject) {
      assert(this.callerPath, '• callerPath should be passed in order to lookup for project configuration.')
      this.setTargetProject({ nestedProjectPath: [this.callerPath] })
      const targetProjectFilesRegex = new RegExp(`^((?!${this.targetProjectConfig.rootPath}).)*$`) // negation - paths that don't include the path i.e. outside the directory.
      this.babelRegisterConfig.ignore.push(targetProjectFilesRegex) // transpile files that are nested in the target project only.
    }

    // Add event listeners
    this.on('fileLoaded', fileObject => this.loadedFiles.push({ ...fileObject }))

    // this.babelRegisterConfig.ignore = [/node_modules/, /^((?!\/d\/code\/App\/gazitengWebapp\/node_modules\/@application\/gazitengWebapp-clientSide).)*$/]
    let revertHook = requireHookUsingBabelRegister({ babelTransformConfig: this.babelTransformConfig, babelRegisterConfig: this.babelRegisterConfig })

    // tracking files is for debugging purposes only, the actual runtime transformation happens in babel `requireHook`. The tracker tries to mimic the glob file matching using the ignore option passed `babelRegisterConfig.ignore`
    runtimeTransformHook({
      emit: (code, filename) => this.emit('fileLoaded', { filename, code }),
      ignoreFilenamePattern: this.babelRegisterConfig.ignore,
      extension: this.babelRegisterConfig.extensions,
    })

    // output transpilation - output transpilation result into filesystem files
    this.setPrimaryTargetProject()
    filesystemTranspiledOutput({
      babelConfig: this.babelTransformConfig,
      extension: this.babelRegisterConfig.extensions,
      ignoreFilenamePattern: this.babelRegisterConfig.ignore,
      shouldTransform: false,
      targetProjectConfig: this.primaryTargetProjectConfig,
    })

    return { revertHook }
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

// track instances in current process
Compiler.instance = []
// // debug created instances in current process
// process.on('exit', () => {
//   for (let compiler of Compiler.instance) console.log(compiler.babelRegisterConfig.ignore)
//   console.log(Compiler.instance[0].babelTransformConfig.ignore === Compiler.instance[1].babelTransformConfig.ignore)
// })

/* TODO: register the modules that registered a require hook for compilation. keep track of all projects that initiated a require hook registration. 
    (How to find out the module path that initiates a Compiler instance without passing in '__dirname' ? 
      i.e. hackish way to find function caller in ECMAscript)
    Seems like a workaround - https://stackoverflow.com/questions/13227489/how-can-one-get-the-file-path-of-the-caller-function-in-node-js */
// Compiler.registeredHook = [] // initialize property.
// Compiler.trackRegisteredHook = () => Compiler.registeredHook.push(/*Project that created a new instance of Compiler*/)

Compiler.transpilationModulePath = path.join(__dirname, '..') // if multiple modules are installed in different packages rather than using the same module.

module.exports = {
  Compiler,
}
