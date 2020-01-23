const projectConfig = require('../../configuration/project.config.js'),
  path = require('path'),
  filesystem = require('fs')

// • Run
// if (filesystem.existsSync(projectConfig.directory.distribution)) {
//   module.exports = require(projectConfig.directory.distribution)
// } else {
// • Transpilation (babelJSCompiler)
// const { Compiler } = require('@deployment/javascriptTranspilation')
// let compiler = new Compiler({ babelConfig: projectConfig.transpilation.babelConfig })
// compiler.requireHook()
module.exports = require(path.join(projectConfig.directory.source, projectConfig.entrypoint.programmaticAPI))
// way to output runtime transpilation in circular dependency.
// process.nextTick(() => {
//   console.log(compiler.loadedFiles) // write any newer files transpiled in successive usage of this module.
// })
// }
