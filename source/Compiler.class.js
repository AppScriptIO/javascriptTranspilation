const path = require('path'),
  filesystem = require('fs'),
  assert = require('assert'),
  EventEmitter = require('events'),
  babelRegister = require(`@babel/register`),
  { addHook: addRequireHook } = require('pirates'),
  { filesystemTranspiledOutput } = require('./additionalRequireHook.js'),
  defaultRequireHookConfig = require('./compilerConfiguration/requireHookConfig.js')

module.exports = targetProjectCallerPath => {
  /**
   * Used to initialize nodejs app with transpiled code using Babel, through an entrypoint.js which loads the app.js after registering the transpilation require hooks.
   */
  class Compiler {
    constructor({ babelTransformConfig, babelRegisterConfig, callerPath, debugKey } = {}) {
      console.log(`Compiler - ${callerPath}`)
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
      matchTargetFile = true, // use passed babel config ignore globs and regex to match files and filter the files to transpile.
    } = {}) {
      if (!matchTargetFile) this.babelRegisterConfig.ignore = []
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

      // this.babelRegisterConfig.ignore = [/node_modules/, /^((?!\/d\/code\/App\/gazitengWebapp\/node_modules\/@application\/gazitengWebapp-clientSide).)*$/]
      let revertHook = requireHook({ babelTransformConfig: this.babelTransformConfig, babelRegisterConfig: this.babelRegisterConfig })

      // tracking files is for debugging purposes only, the actual runtime transformation happens in babel `requireHook`. The tracker tries to mimic the glob file matching using the ignore option passed `babelRegisterConfig.ignore`
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
  Compiler.trackRegisteredHook = () => Compiler.registeredHook.push(targetProjectCallerPath)

  return Compiler
}
