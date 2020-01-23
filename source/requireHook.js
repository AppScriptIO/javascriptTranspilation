const path = require('path'),
  filesystem = require('fs'),
  assert = require('assert'),
  babel = require('@babel/core'),
  { addHook: addRequireHook } = require('pirates'),
  { removeMatchingStringFromBeginning } = require('./utility/removeMatchingStringFromBeginning.js'),
  defaultOutputRelativePath = './temporary/transpiled',
  isPreservedSymlink = require('./utility/isPreservedSymlinkFlag.js')

//! Important: @babel/register when called multiple times overrides the previous registered hook. Which doesn't allow to register more than one hook. or the caching system prevent checking same file by next hooks.
// https://github.com/babel/babel/blob/master/packages/babel-register/src/node.js
function babelRegister({ babelRegisterConfig }) {
  //! Importatnt: Babel register initially executes on load and will hook itself to require wihthout any plugins or presets, until the next call adds the configuration.
  const _babelRegister = require(`@babel/register`) // Note: may cause errors if loaded with no intention to hook it, as it will parse every required file without plugins and may cause syntax errors.
  // console.group(`\x1b[2m\x1b[3m• Babel:\x1b[0m Compiling code at runtime.`)
  // The require hook will bind itself to node's require and automatically compile files on the fly
  return _babelRegister(babelRegisterConfig) // Compile code on runtime.
  // console.groupEnd()
}

// Use instead of babel register to allow registering multiple different hooks with different rules.
// TODO: Note: this doesn't include caching like in https://github.com/babel/babel/blob/master/packages/babel-register/src/node.js
function babelTransform({ babelConfig, extension, ignoreNodeModules = false, ignoreFilenamePattern = [] /* Array of Regex type */ } = {}) {
  return addRequireHook(
    (code, filename) => {
      // similar to the behavior of @babel/register, `babel.OptionManager().init` adds some properties, e.g. envName, cwd, root.
      babelConfig = Object.assign({} /*prevent conflicts by creating new object*/, babelConfig, { filename /** filename is required */, sourceRoot: path.dirname(filename) })
      const options = new babel.OptionManager().init(babelConfig)

      let transformed
      // transformed = babel.transformFileSync(filename, options)
      transformed = babel.transformSync(code, options)
      // transformed.code transformed.map
      return transformed.code
    },
    {
      exts: extension,
      ignoreNodeModules,
      matcher: filename => {
        let matchIgnore = ignoreFilenamePattern.some(regex => filename.match(regex))
        return !matchIgnore
      },
    },
  )
}

// passthrough hook
function trackFile({ ignoreFilenamePattern, extension, emit }) {
  return addRequireHook(
    (code, filename) => {
      emit(code, filename)
      return code // pass to next registered hook without changes.
    },
    {
      exts: extension,
      ignoreNodeModules: false,
      matcher: filename => {
        let matchIgnore = ignoreFilenamePattern.some(regex => filename.match(regex))
        return !matchIgnore
      },
    },
  )
}

function writeFileToDisk({ targetProjectConfig, outputRelativePath, extension, ignoreNodeModules = false, ignoreFilenamePattern = [] /* Array of Regex type */ }) {
  // if (!isPreservedSymlinkFlag()) console.warn('• Not using node runtime preserve symlink flag may will may output symlink folders to distribution folder with path relative to target project ')
  outputRelativePath = (targetProjectConfig.transpilation && targetProjectConfig.transpilation.outputDirectory) || defaultOutputRelativePath
  return addRequireHook(
    (code, filename) => {
      let content
      content = code

      // wrtie to filesystem
      let outputPath = path.join(targetProjectConfig.rootPath, outputRelativePath)
      let relativeFilePath = removeMatchingStringFromBeginning({ basePath: targetProjectConfig.rootPath, targetPath: filename })
      let traspiledFilePath = path.join(outputPath, relativeFilePath)
      // create directory
      filesystem.mkdirSync(path.dirname(traspiledFilePath), { recursive: true })
      // write file
      // console.log(`📢 Writing runtime transpilation files to ${traspiledFilePath}`)
      filesystem.writeFileSync(traspiledFilePath, content, { encoding: 'utf8' })
      return code
    },
    {
      exts: extension,
      ignoreNodeModules: ignoreNodeModules,
      matcher: filename => {
        let matchIgnore = ignoreFilenamePattern.some(regex => filename.match(regex))
        return !matchIgnore
      },
    },
  )
}

module.exports = { trackFile, babelTransform, writeFileToDisk, babelRegister }
