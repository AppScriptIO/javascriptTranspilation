// TODO - output transpiled files to filesystem destination folder during runtime, which allows for debugging the transpiled code.
const { transformFileAsync, transformFileSync } = require('@babel/core'),
  { addHook } = require('pirates'),
  path = require('path'),
  filesystem = require('fs'),
  assert = require('assert'),
  isPreservedSymlinkFlag = require('./utility/isPreservedSymlinkFlag.js'),
  { removeMatchingStringFromBeginning } = require('./utility/removeMatchingStringFromBeginning.js'),
  defaultOutputRelativePath = './distribution'

function generateHookCallback({ babelConfig, shouldTransform = false, targetProjectConfig, outputRelativePath = defaultOutputRelativePath }) {
  if (!isPreservedSymlinkFlag({ shouldThrow: false })) console.warn('• `preserve symlink` flag is off. Symlinked directories may be skipped.')
  return (code, filename) => {
    let content

    if (shouldTransform) {
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
    } else {
      content = code
    }

    // if (!filename.includes('node_modules') && filename.includes('script.js')) {
    //   console.log(filename)
    //   console.log(content)
    // }

    // wrtie to filesystem
    debugger
    let outputPath = path.join(targetProjectConfig.rootPath, outputRelativePath)
    let relativeFilePath = removeMatchingStringFromBeginning({ basePath: targetProjectConfig.rootPath, targetPath: filename })
    traspiledFilePath = path.join(outputPath, relativeFilePath)
    // create directory
    filesystem.mkdirSync(path.dirname(traspiledFilePath), { recursive: true })
    // write file
    filesystem.writeFileSync(traspiledFilePath, content, { encoding: 'utf8' })
    return code
  }
}

function filesystemTranspiledOutput({
  babelConfig,
  extension,
  ignoreNodeModules = false,
  ignoreFilenamePattern = [] /* Array of Regex type */,
  outputRelativePath,
  shouldTransform,
  targetProjectConfig,
}) {
  debugger
  outputRelativePath = (targetProjectConfig.transpilation && targetProjectConfig.transpilation.outputDirectory) || outputRelativePath
  addHook(generateHookCallback({ babelConfig, shouldTransform, targetProjectConfig, outputRelativePath }), {
    exts: extension,
    ignoreNodeModules: ignoreNodeModules,
    matcher: filename => (ignoreFilenamePattern.some(regex => filename.match(regex)) ? false : true),
  })
}

module.exports = { filesystemTranspiledOutput, generateHookCallback }
