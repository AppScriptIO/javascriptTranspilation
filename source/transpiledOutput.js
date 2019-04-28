// TODO - output transpiled files to filesystem destination folder during runtime, which allows for debugging the transpiled code.
const { transformFileAsync, transformFileSync } = require('@babel/core'),
  { addHook } = require('pirates'),
  path = require('path'),
  filesystem = require('fs')

/**
 * Example:
 * basePath = `/x/y/`
 * targetPath = `/x/y/z/t.js`
 * --> `/z/t.js`
 */
function removeMatchingStringFromBeginning({ basePath, targetPath }) {
  let filenameArray = targetPath.split('/').filter(n => n)
  let rootPathArray = basePath.split('/').filter(n => n)
  let beggingMatch = true,
    index = 0
  while (beggingMatch && filenameArray.length >= index && rootPathArray.length >= index) {
    if (filenameArray[index] == rootPathArray[index]) filenameArray[index] = null
    else beggingMatch = false
    index++
  }
  return filenameArray.join('/')
}

function filesystemTranspiledOutput({ babelConfig, extension, ignoreNodeModules = false, ignoreFilenamePattern = [] /* Array of Regex type */, outputPath = null }) {
  addHook(
    (code, filename) => {
      if (true || outputPath) {
        let transformed = transformFileSync(filename, Object.assign({ sourceMaps: 'both' /*inline & include in result object*/ || 'inline' || true, ast: false }, babelConfig))
        // transformed.code transformed.map
        filename = transformed.options.filename
        let rootPath = transformed.options.root
        outputPath = path.join(rootPath, 'distribution')
        let relativeFilePath = removeMatchingStringFromBeginning({ basePath: rootPath, targetPath: filename })
        traspiledFilePath = path.join(outputPath, relativeFilePath)
        // create directory
        filesystem.mkdirSync(path.dirname(traspiledFilePath), { recursive: true })
        // write file
        filesystem.writeFileSync(traspiledFilePath, transformed.code, { encoding: 'utf8' })
      }
      return code
    },
    {
      exts: extension,
      ignoreNodeModules: ignoreNodeModules,
      matcher: filename => (ignoreFilenamePattern.some(regex => filename.match(regex)) ? false : true),
    },
  )
}

module.exports = {
  filesystemTranspiledOutput,
}
