// clone config
module.exports = () => {
  return {
    // When a file path matches this regex then it is **not** compiled
    ignore: [/node_modules/] || [/node_modules\/(?!@dependency)/], // ignore everythng in node_modules except internal modules.
    // https://babeljs.io/docs/en/options - similar to default @babel/register options
    sourceMaps: 'both' /*inline & include in result object*/ || 'inline' || true,
    ast: false,
    babelrc: false,
    configFile: false,
    passPerPreset: false,
  }
}
