const path = require('path'),
  filesystem = require('fs'),
  assert = require('assert'),
  EventEmitter = require('events'),
  requireHook = require('./requireHook.js'),
  { defaultRequireHookConfig } = require('./getConfig.js'),
  deepCloneJSNativeType = require('clone-deep'),
  { mergeNonexistentProperties } = require('@dependency/handleJSNativeDataStructure')

/**
 * Used to initialize nodejs app with transpiled code using Babel, through an entrypoint.js which loads the app.js after registering the transpilation require hooks.
 */
class Compiler extends EventEmitter {
  constructor({ babelConfig, callerPath } = {}) {
    super()
    Compiler.instance.push(this) // track instances

    this.config = babelConfig
    this.callerPath = callerPath

    /** Usage: 
      ```
        process.on('exit', () => {
          console.log(compiler.loadedFiles.map(value => value.filename))
          console.log(compiler.babelRegisterConfig.ignore)
        })
      ```
      */
    this.loadedFiles = this.loadedFiles || []

    this.initializeTransformConfiguration() // set babel config values
  }

  // babel configurations - plugins, presets, ignore, extensions, etc.
  initializeTransformConfiguration() {
    // make sure the object passed is unique (prevent conflicts in case configs are used from the same module multiple times)
    // as the properties of this.config can be modified by the instance (e.g. this.config.ignore)
    this.config = deepCloneJSNativeType(this.config)
    assert(defaultRequireHookConfig.ignore, `• Must contain at least ignore property, as it is used in the Compiler instance and modified when needed.`)
    // merge only if properties doesn't exist
    mergeNonexistentProperties(this.config, deepCloneJSNativeType(defaultRequireHookConfig) /*clone deep objects to prevent conflicts between instances.*/)

    if (!this.config.plugins && !this.config.presets) {
      assert(
        this.targetProjectConfig.configuration.transpilation && this.targetProjectConfig.configuration.transpilation.babelConfig,
        `• Project configuration must have 'transpilation' & nested 'babelConfig' entries.`,
      )
      this.setTargetProject()
      Object.assign(this.config, this.targetProjectConfig.configuration.transpilation.babelConfig)
    }
  }

  requireHook({ restrictToTargetProject = true /* this option when false allows circular dependency `configurationManagement` to use transpilation. */ } = {}) {
    if (restrictToTargetProject) {
      this.setTargetProject()
      // babel config ignore globs and regex to match files and filter the files to transpile
      const targetProjectFilesRegex = new RegExp(`^((?!${this.targetProjectConfig.rootPath}).)*$`) // negation - paths that don't include the path i.e. outside the directory.
      this.config.ignore.push(targetProjectFilesRegex) // transpile files that are nested in the target project only.
    }

    // Add event listeners
    this.on('fileLoaded', fileObject => this.loadedFiles.push({ ...fileObject }))

    // this.config.ignore = [/node_modules/, /^((?!\/d\/code\/App\/gazitengWebapp\/node_modules\/@application\/gazitengWebapp-clientSide).)*$/]
    let revertHook = requireHook.babelRegister({ babelConfig: this.config })

    // tracking files is for debugging purposes only, the actual runtime transformation happens in babel `requireHook`. The tracker tries to mimic the glob file matching using the ignore option passed `babelRegisterConfig.ignore`
    requireHook.trackFile({
      emit: (code, filename) => this.emit('fileLoaded', { filename, code }),
      ignoreFilenamePattern: this.config.ignore,
      extension: this.config.extensions,
    })

    // output transpilation - output transpilation result into filesystem files
    this.setPrimaryTargetProject()
    requireHook.writeFileToDisk({
      extension: this.config.extensions,
      ignoreFilenamePattern: this.config.ignore,
      shouldTransform: false,
      targetProjectConfig: this.primaryTargetProjectConfig,
    })

    return { revertHook }
  }

  // lookup the project that instantiated a Compiler instance.
  setTargetProject() {
    if (this.targetProjectConfig) return
    assert(this.callerPath, '• callerPath should be passed in case babel configuration was not provided')
    const { findTargetProjectRoot } = require('@dependency/configurationManagement') // require here to prevent cyclic dependency with this module, as the module may use runtime transpilation (i.e. will use exported functionality from this module).
    this.targetProjectConfig = findTargetProjectRoot({ nestedProjectPath: [this.callerPath] })
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
