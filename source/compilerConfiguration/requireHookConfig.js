module.exports = {
  requireHook: {
    // When a file path matches this regex then it is **not** compiled
    ignore: [/node_modules/] || [/node_modules\/(?!@dependency)/], // ignore everythng in node_modules except internal modules.
    // Setting this will remove the currently hooked extensions of `.es6`, `.es`, `.jsx`, `.mjs`
    // and .js so you'll have to add them back if you want them to be used again.
    extensions: ['.js', '.mjs', '.ts'], // default is ".es6", ".es", ".jsx", ".js", ".mjs"
  },
}
