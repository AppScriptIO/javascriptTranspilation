// TODO - output transpiled files to filesystem destination folder during runtime, which allows for debugging the transpiled code.
const { transformFileAsync, transformFileSync } = require('@babel/core'), 
  { addHook } = require('pirates')

function filesystemTranspiledOutput({ babelConfig, extension }) {
  addHook(
    (code, filename) => {
        let transformed = transformFileSync(filename, Object.assign({ sourceMaps: false, ast: false }, babelConfig))
        // .then(result => {
        //     console.log(filename) 
        //     if(filename.includes('testGenerator.js'))
        filename = transformed.options.filename
        // if(filename == '/c/Users/Entrepreneur/Projects/Dependency/nodeRelationshipGraph/test/generators.test.js') console.log(transformed.code)
        return code
    }, 
    { exts: extension, ignoreNodeModules: true }
  )
}

module.exports = {
  filesystemTranspiledOutput
}
  