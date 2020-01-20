// babel JS Compiler - This file should be written in native ES
// .babelrc doesn't have a way to specify path.

const path = require('path'),
  assert = require('assert'),
  moduleSystem = require('module'),
  { isPreservedSymlinkFlag } = require('./utility/isPreservedSymlinkFlag.js'),
  { addModuleResolutionPathMultiple } = require(`@dependency/addModuleResolutionPath`)
// let findTargetProjectRoot // possible circular dependency.

// Using `preserve symlink` node runtime flag will cause infinite circular dependency, where each will load the module with different accumulative path when symlinking node_modules to each other.
if (isPreservedSymlinkFlag()) throw new Error('• `preserve symlink` node runtime flag will cause circular issues.')
;(() => {
  // initialize - register Node Module Resolution Path
  const babelModulesPath = path.dirname(path.dirname(path.dirname(require.resolve('@babel/core/package.json')))) // get the node_modules folder where Babel plugins are installed. Could be own package root or parent packages root (when this modules is installed as a pacakge)
  addModuleResolutionPathMultiple({ pathArray: [babelModulesPath] }) // Add babel node_modules to module resolving paths
})()

/**
 * Early export of necessary modules to allow nested dependencies or circular dependencies to use the independent exports.
 * export before importing possible circular dependencies.
 * export ecmascript specification complient modules allow circular module dependencyز
 */
const targetProjectCallerPath = module.parent.parent.filename // Requiring module's path: first parent module is the entrypoint `index.js`, second is the module that calls the require hook.
Object.assign(module.exports, require('./getConfig.js'), require('./transpileSourcePath.js'), { Compiler: require('./Compiler.class.js')(targetProjectCallerPath) })

// ;({ findTargetProjectRoot } = require('@dependency/configurationManagement')) // require here to prevent cyclic dependency with this module, as the module may use runtime transpilation (i.e. will use exported functionality from this module).
