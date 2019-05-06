const { transformFileSync } = require('@babel/core'),
  { addHook: addRequireHook } = require('pirates'),
  path = require('path'),
  filesystem = require('fs'),
  assert = require('assert'),
  { removeMatchingStringFromBeginning } = require('./utility/removeMatchingStringFromBeginning.js'),
  defaultOutputRelativePath = './temporary/transpiled',
  isPreservedSymlink = require('./utility/isPreservedSymlinkFlag.js')

function filesystemTranspiledOutput({
  babelConfig,
  shouldTransform = false,
  targetProjectConfig,
  outputRelativePath = defaultOutputRelativePath,
  extension,
  ignoreNodeModules = false,
  ignoreFilenamePattern = [] /* Array of Regex type */,
}) {
  // if (!isPreservedSymlinkFlag()) console.warn('• Not using node runtime preserve symlink flag may will may output symlink folders to distribution folder with path relative to target project ')
  outputRelativePath = (targetProjectConfig.transpilation && targetProjectConfig.transpilation.outputDirectory) || outputRelativePath
  addRequireHook(
    (code, filename) => {
      let content

      if (shouldTransform) {
      } else {
        content = code
      }

      // wrtie to filesystem
      let outputPath = path.join(targetProjectConfig.rootPath, outputRelativePath)
      let relativeFilePath = removeMatchingStringFromBeginning({ basePath: targetProjectConfig.rootPath, targetPath: filename })
      traspiledFilePath = path.join(outputPath, relativeFilePath)
      // create directory
      filesystem.mkdirSync(path.dirname(traspiledFilePath), { recursive: true })
      // write file
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

function transformHook({ extension, ignoreNodeModules = false, ignoreFilenamePattern = [] /* Array of Regex type */ } = {}) {
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

module.exports = { transformHook, filesystemTranspiledOutput }
