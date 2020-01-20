// Compiler configuration includes `babel transform` options & `@babel/register` configuration.
function getCompilerConfig(configKey) {
  return require(`./compilerConfiguration/${configKey}`) // load configuration equivalent to .babelrc options
}

// export babel configuratio sets as well
function getBabelConfig(babelConfigFilename, { configType = 'json' } = {}) {
  const jsonConfig = require(`./compilerConfiguration/${babelConfigFilename}`)
  switch (configType) {
    case 'functionApi':
      return api => {
        api.cache.forever()
        return jsonConfig.babelConfig
      }
      break
    case 'json':
    default:
      return jsonConfig.babelConfig
      break
  }
  return
}

module.exports = { getBabelConfig, getCompilerConfig }
