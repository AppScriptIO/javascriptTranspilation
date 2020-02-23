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
  constructor({
    callerPath,
    // https://github.com/babel/babel/blob/master/packages/babel-core/src/config/validation/options.js
    babelConfig = {},
    /* 
      configurations related to hook registrations or @babel/register
      Note: extensions are not valid babel configuration, therefore must be passed separately. 
    */
    // Setting this will remove the currently hooked extensions of `.es6`, `.es`, `.jsx`, `.mjs` and .js so you'll have to add them back if you want them to be used again.
    extensions = ['.js', '.mjs', '.ts'], // default is ".es6", ".es", ".jsx", ".js", ".mjs"
  } = {}) {
    super()
    Compiler.instance.push(this) // track instances

    this.config = babelConfig
    this.extensions = extensions
    this.callerPath = callerPath

    /** Usage: 
      ```
        process.on('exit', () => {
          console.log(compiler.loadedFiles.map(value => value.filename))
          console.log(compiler.config.ignore)
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
      this.setTargetProject() // lookup project config

      let transpilationConfig = this.targetProjectConfig.getTranspilation()
      assert(transpilationConfig && transpilationConfig.babelConfig, `• Project (${this.targetProjectConfig.rootPath}) configuration must have 'transpilation' & nested 'babelConfig' entries.`)
      Object.assign(this.config, transpilationConfig.babelConfig)
    }

    // add caller name, similar to @babel/register behavior - https://github.com/babel/babel/blob/master/packages/babel-register/src/node.js#L128
    Object.assign(this.config, { caller: { name: '@deployment/javascriptTranspilation' } })
  }

  requireHook({
    restrictToTargetProject = true || '<projectRootPath' /* this option when false or string provided allows circular dependency `configurationManagement` to use transpilation. */,
  } = {}) {
    let revertHookList = []

    let projectRootPath
    if (restrictToTargetProject) {
      if (typeof restrictToTargetProject == 'string') projectRootPath = restrictToTargetProject
      else {
        this.setTargetProject()
        projectRootPath = this.targetProjectConfig.rootPath
      }

      // babel config ignore globs and regex to match files and filter the files to transpile
      const targetProjectFilesRegex = new RegExp(`^((?!${projectRootPath}).)*$`) // negation - paths that don't include the path i.e. outside the directory.
      this.config.ignore.push(targetProjectFilesRegex) // transpile files that are nested in the target project only.
    }

    // Add event listeners
    this.on('fileLoaded', fileObject => this.loadedFiles.push(fileObject))

    // Hooks executed in order
    // #1 - tracking files is for debugging purposes only, the actual runtime transformation happens in babel `requireHook`. The tracker tries to mimic the glob file matching using the ignore option passed `config.ignore`
    {
      let revertHook = requireHook.trackFile({
        emit: (code, filename) => this.emit('fileLoaded', { filename, code }),
        ignoreFilenamePattern: this.config.ignore,
        extension: this.extensions,
      })
      revertHookList.push(revertHook)
    }

    // #2 - Runtime transpilation
    {
      console.log(`[javascriptTranspilation] Registered Nodejs require hook for runtime transpilation - ${this.callerPath || 'Unknown compiler.callerPath'}`)
      // this.config.ignore = [/node_modules/, /^((?!\/webapp\/node_modules\/@service\/webapp-clientSide).)*$/]
      let revertHook
      // revertHook = requireHook.babelRegister({ babelRegisterConfig: Object.assign({ extensions: this.extensions }, this.config) }) //! babelRegister doesn't support multiple hooks, and will override previous ones.
      revertHook = requireHook.babelTransform({ babelConfig: this.config, extension: this.extensions, ignoreNodeModules: false, ignoreFilenamePattern: this.config.ignore })
      revertHookList.push(revertHook)
    }

    // #3 - output transpilation - output transpilation result into filesystem files
    {
      this.setPrimaryTargetProject()
      let revertHook = requireHook.writeFileToDisk({
        extension: this.extensions,
        ignoreFilenamePattern: this.config.ignore,
        targetProjectConfig: this.primaryTargetProjectConfig,
      })
      revertHookList.push(revertHook)
    }

    return { revertHook: () => revertHookList.forEach(revert => revert()) }
  }

  // lookup the project that instantiated a Compiler instance.
  setTargetProject() {
    if (this.targetProjectConfig) return
    assert(this.callerPath, '• callerPath should be passed in case babel configuration was not provided')
    const { findTargetProjectRoot } = require('@deployment/configurationManagement') // require here to prevent cyclic dependency with this module, as the module may use runtime transpilation (i.e. will use exported functionality from this module).

    // NOTE: DOESN'T WORK - check for circular dependency
    // let moduleLoaded
    // try {
    //   moduleLoaded = !!require.cache[require.resolve('@deployment/configurationManagement')]
    // } catch (ex) {
    //   moduleLoaded = false
    // }
    // assert(moduleLoaded, '• configurationManagement module did not finish loading, a circular dependency probably caused by symlinking to with runtime transpilation of the module')

    this.targetProjectConfig = findTargetProjectRoot({ nestedProjectPath: [this.callerPath] })
  }

  // main target project that initiated the node process from cli or require the module before being cached, in cases where node_modules are also transpiled.
  setPrimaryTargetProject({ nestedProjectPath = [process.cwd(), module.parent.filename /* The place where the module was required from */] } = {}) {
    if (this.primaryTargetProjectConfig) return
    const { findTargetProjectRoot } = require('@deployment/configurationManagement') // require here to prevent cyclic dependency with this module, as the module may use runtime transpilation (i.e. will use exported functionality from this module).
    this.primaryTargetProjectConfig = findTargetProjectRoot({ nestedProjectPath })
  }
}

// track instances in current process
Compiler.instance = []
// // debug created instances in current process
// process.on('exit', () => {
//   for (let compiler of Compiler.instance) console.log(compiler.config.ignore)
//   console.log(Compiler.instance[0].babelConfig.ignore === Compiler.instance[1].babelConfig.ignore)
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
