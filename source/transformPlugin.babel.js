const _path = require('path')
const resolveModule = require('resolve') // resolve optoins https://www.npmjs.com/package/resolve#resolveid-opts-cb
const babel = require('@babel/core')
const CONCAT_NO_PACKAGE_ERROR = 'Dynamic import with a concatenated string should start with a valid full package name.'

{
  // const resolveBaseModule = require('@rollup/plugin-node-resolve')
  function resolveUsingExternalPackage() {
    //   let resolved = resolveBaseModule({
    //     // not all files you want to resolve are .js files
    //     extensions: ['.mjs', '.js', '.jsx', '.json'], // Default: [ '.mjs', '.js', '.json', '.node' ]
    //     // the fields to scan in a package.json to determine the entry point
    //     // if this list contains "browser", overrides specified in "pkg.browser"
    //     // will be used
    //     mainFields: ['module', 'main'], // Default: ['module', 'main']
    //     // some package.json files have a "browser" field which specifies alternative files to load for people bundling for the browser. If that's you, either use this option or add "browser" to the "mainfields" option, otherwise pkg.browser will be ignored
    //     browser: false, // Default: false
    //     // whether to prefer built-in modules (e.g. `fs`, `path`) or local ones with the same names
    //     preferBuiltins: false, // Default: true
    //     // Lock the module search in this path (like a chroot). Module defined outside this path will be marked as external
    //     jail: '/', // Default: '/'
    //     // Set to an array of strings and/or regexps to lock the module search to modules that match at least one entry. Modules not matching any entry will be marked as external
    //     // only: ['some_module', /^@some_scope\/.*$/], // Default: null
    //     // If true, inspect resolved files to check that they are ES2015 modules
    //     modulesOnly: false, // Default: false
    //     // Force resolving for these modules to root's node_modules that helps
    //     // to prevent bundling the same package multiple times if package is
    //     // imported from dependencies.
    //     // dedupe: ['react', 'react-dom'], // Default: []
    //     // Any additional options that should be passed through
    //     // to node-resolve
    //     // customResolveOptions: {
    //     //   moduleDirectory: 'js_modules',
    //     // },
    //   })
  }
}

/**
 * Babel transform plugin converts name modules beginning with @ to their relative path counterparts or a named module (non-relative path).
 * transform example "@polymer/polymer/element.js" --> "/@webcomponent/@package/@polymer/polymer/element.js"
 * transform example "lit-html/lib/lit-extended.js" --> "/@webcomponent/@package/lit-html/lib/lit-extended.js"
 * https://astexplorer.net/
  
  implementation in open-wc 
    - https://github.com/open-wc/open-wc/blob/master/packages/es-dev-server/src/utils/resolve-module-imports.js#L79
    - https://github.com/open-wc/open-wc/blob/master/packages/es-dev-server/src/utils/resolve-module-imports.js
    - https://github.com/rollup/plugins/blob/master/packages/node-resolve/src/index.js#L29
    - https://open-wc.org/developing/es-dev-server.html#startserver
    - https://github.com/rollup/plugins/tree/master/packages/node-resolve
    - https://github.com/guybedford/es-module-lexer
    - https://github.com/open-wc/open-wc/blob/master/packages/es-dev-server/src/utils/babel-transform.js
    - https://github.com/tleunen/babel-plugin-module-resolver/blob/master/src/index.js


//  TODO: implement Dedop imports.
 */
module.exports.transformNamedModuleToPath = function() {
  return {
    visitor: {
      'ImportDeclaration|ExportNamedDeclaration'(path, state) {
        if (!path.node.source) return
        let importer = state.file.opts.filename, // absolute path of current file being transformed
          source = path.node.source,
          importee = source.value

        // if bare import, i.e. not absolute or relative path
        if (source.value.startsWith('/') || source.value.startsWith('.')) return

        let pathToResolve = importee
        let pathToAppend = ''

        const parts = importee.split('/')
        if (importee.startsWith('@')) {
          if (parts.length < 2) throw new Error(CONCAT_NO_PACKAGE_ERROR)

          pathToResolve = `${parts[0]}/${parts[1]}`
          pathToAppend = parts.slice(2, parts.length).join('/')
        } else {
          if (parts.length < 1) throw new Error(CONCAT_NO_PACKAGE_ERROR)
          ;[pathToResolve] = parts
          pathToAppend = parts.slice(1, parts.length).join('/')
        }

        const lookupDirectory = _path.dirname(importer),
          moduleDirectory = ['node_modules', '@package']

        // if no specific file in the target module is specified (e.g. `lit-html/specific.js`)
        let resolvedPath
        if (pathToAppend) {
          pathToResolve = `${pathToResolve}/package.json`
          let resolvedPackage = resolveModule.sync(pathToResolve, { basedir: lookupDirectory, moduleDirectory })
          const packageDir = resolvedPackage.substring(0, resolvedPackage.length - 'package.json'.length)
          resolvedPath = `${packageDir}${pathToAppend}`
        } else {
          resolvedPath = resolveModule.sync(pathToResolve, {
            basedir: lookupDirectory,
            moduleDirectory,
            // use "module" field instead of "main" field when present
            packageFilter: package => {
              if (package.module) package.main = package.module
              return package
            },
          })
        }

        // create relative path for browser consumption
        let relativePathFromImporter = `./${_path.relative(_path.dirname(importer) /*relative to folder*/, resolvedPath)}`

        // console.log(`importee: ${importee}`)
        // console.log(`importer: ${importer}`)
        // console.log(`resolvedPath: ${resolvedPath}`)
        // console.log(`relativePathFromImporter: ${relativePathFromImporter}`)
        // console.log('\n')
        source.value = relativePathFromImporter
      },
    },
  }
}
