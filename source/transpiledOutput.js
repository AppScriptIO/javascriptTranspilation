// TODO - output transpiled files to filesystem destination folder during runtime, which allows for debugging the transpiled code.
const { transformFileAsync, transformFileSync } = require('@babel/core'),
  { addHook } = require('pirates'),
  path = require('path'),
  filesystem = require('fs'),
  assert = require('assert'),
  { removeMatchingStringFromBeginning } = require('./utility/removeMatchingStringFromBeginning.js')

function filesystemTranspiledOutput({
  babelConfig,
  extension,
  ignoreNodeModules = false,
  ignoreFilenamePattern = [] /* Array of Regex type */,
  outputRelativePath = './distribution',
  shouldTransform = false,
  targetProjectConfig,
}) {
  outputRelativePath = (targetProjectConfig.transpilation && targetProjectConfig.transpilation.outputDirectory) || outputRelativePath
  addHook(
    (code, filename) => {
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

      if (!filename.includes('node_modules') && filename.includes('script.js')) {
        console.log(filename)
        console.log(content)
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

module.exports = { filesystemTranspiledOutput }
