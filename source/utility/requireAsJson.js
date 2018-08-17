// example usage - 
//      const babelDefaultConfig = requireJSON(`${__dirname}/.babelrc`) // load babelrc json.
//      babelDefaultConfig.babelrc = false; // don't search for babelrc in transpiled file location.

// load non json extension as json.
function requireAsJSON(filePath) { return JSON.parse(filesystem.readFileSync(filePath, "utf8")) }

module.exports = {
    requireAsJSON
}