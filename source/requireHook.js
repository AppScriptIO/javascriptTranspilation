const path = require('path'),
  filesystem = require('fs'),
  assert = require('assert'),
  { transformFileSync } = require('@babel/core'),
  { addHook: addRequireHook } = require('pirates'),
  babelRegister = require(`@babel/register`),
  { removeMatchingStringFromBeginning } = require('./utility/removeMatchingStringFromBeginning.js'),
  defaultOutputRelativePath = './temporary/transpiled',
  isPreservedSymlink = require('./utility/isPreservedSymlinkFlag.js')

function babelRegister({ babelConfig }) {
  // console.group(`\x1b[2m\x1b[3m• Babel:\x1b[0m Compiling code at runtime.`)
  // The require hook will bind itself to node's require and automatically compile files on the fly
  babelRegister(babelConfig) // Compile code on runtime.
  // console.groupEnd()
}

function trackFile({ ignoreFilenamePattern, extension, emit }) {
  addRequireHook(
    (code, filename) => {
      emit(code, filename)
      return code // pass to next registered hook without changes.
    },
    {
      exts: extension,
      ignoreNodeModules: false,
      matcher: filename => (ignoreFilenamePattern.some(regex => filename.match(regex)) ? false : true),
    },
  )
}

function writeFileToDisk({
  targetProjectConfig,
  outputRelativePath,
  extension,
  ignoreNodeModules = false,
  ignoreFilenamePattern = [] /* Array of Regex type */,
}) {
  // if (!isPreservedSymlinkFlag()) console.warn('• Not using node runtime preserve symlink flag may will may output symlink folders to distribution folder with path relative to target project ')
  outputRelativePath = (targetProjectConfig.transpilation && targetProjectConfig.transpilation.outputDirectory) || defaultOutputRelativePath
  addRequireHook(
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
      matcher: filename => (ignoreFilenamePattern.some(regex => filename.match(regex)) ? false : true),
    },
  )
}

function babelTransformFile({ babelConfig, extension, ignoreNodeModules = false, ignoreFilenamePattern = [] /* Array of Regex type */ } = {}) {
  addRequireHook(
    (code, filename) => {
      let content

      let transformed = transformFileSync(
        filename,
        Object.assign(
          {
            // https://babeljs.io/docs/en/options
            sourceMaps: 'both' /*inline & include in result object*/ || 'inline' || true,
            ast: false,
          },
          babelConfig,
        ),
      )
      // transformed.code transformed.map
      content = transformed.code
      return content
    },
    {
      exts: extension,
      ignoreNodeModules: ignoreNodeModules,
      matcher: filename => (ignoreFilenamePattern.some(regex => filename.match(regex)) ? false : true),
    },
  )
}

module.exports = { trackFile, babelTransformFile, writeFileToDisk, babelRegister }
