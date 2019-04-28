// TODO - output transpiled files to filesystem destination folder during runtime, which allows for debugging the transpiled code.
const { transformFileAsync, transformFileSync } = require('@babel/core'),
  { addHook } = require('pirates'),
  path = require('path'),
  filesystem = require('fs'),
  assert = require('assert')

// retrieve the root path to the project where the target javascript files to be transpiled belong to.
function findTargetProjectRoot({ nestedProjectPath /* Array of paths */ }) {
  const { configurationFileLookup } = require('@dependency/configurationManagement') // require here to prevent cyclic dependency with this module.
  let targetProjectConfig
  for (let lookupPath of nestedProjectPath) {
    try {
      ;({ configuration: targetProjectConfig } = configurationFileLookup({ currentDirectory: lookupPath }))
      break
    } catch (error) {
      // ignore
    }
  }
  assert(targetProjectConfig, `• target project configuration file was not found from possible lookup paths.`)
  return targetProjectConfig
}

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

function filesystemTranspiledOutput({
  babelConfig,
  extension,
  ignoreNodeModules = false,
  ignoreFilenamePattern = [] /* Array of Regex type */,
  outputRelativePath = './distribution',
  pathRequiredFrom = [],
}) {
  let targetProjectConfig = findTargetProjectRoot({ nestedProjectPath: pathRequiredFrom })
  outputRelativePath = (targetProjectConfig.transpilation && targetProjectConfig.transpilation.outputDirectory) || outputRelativePath
  addHook(
    (code, filename) => {
      let transformed = transformFileSync(filename, Object.assign({ sourceMaps: 'both' /*inline & include in result object*/ || 'inline' || true, ast: false }, babelConfig))
      // transformed.code transformed.map
      let outputPath = path.join(targetProjectConfig.rootPath, outputRelativePath)
      let relativeFilePath = removeMatchingStringFromBeginning({ basePath: targetProjectConfig.rootPath, targetPath: filename })
      traspiledFilePath = path.join(outputPath, relativeFilePath)
      // create directory
      filesystem.mkdirSync(path.dirname(traspiledFilePath), { recursive: true })
      // write file
      filesystem.writeFileSync(traspiledFilePath, transformed.code, { encoding: 'utf8' })
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
