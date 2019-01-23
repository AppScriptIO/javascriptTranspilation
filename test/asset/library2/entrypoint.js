// const { babelJSCompiler } = require('../../../source/entrypoint.js')

// babelJSCompiler({ babelConfigurationFile: 'changeTextToEmoji.BabelConfig.js' })

const babelRegister = require(`@babel/register`)

// hook Babel into the Node's require (all subsequent requires will be affected.)
// babelRegister({
//     // config.bable.js lookup
//     // configFile: false, // use specific file path, preventing lookup.
//     rootMode: "upward-optional", // lookup algorithm.
//     // root: '', // the initial path for lookup - defaults to entrypoint path or cwd

//     // babelrc lookup - Babel loads .babelrc (and .babelrc.js / package.json#babel) files by searching up the directory structure starting from the "filename" being compiled.
//     babelrc: true, 
//     babelrcRoots: [ // paths to lookup from (files being transpiled need to be inside these paths for babelrc to be loaded).
//     //     // Keep the root as a root
//         "./*",      
//     //     // // Also consider monorepo packages "root" and load their .babelrc files.
//     //     // "./packages/*"
//     ],

//     // config merging options:
//     // extends: [],
//     // overrides: []
    
//     cache: false // disable caching required modules which takes effect between node processes.
// })

module.exports = require('./script2.js')