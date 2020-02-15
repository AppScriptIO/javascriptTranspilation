const path = require('path')
const resolvedModule = {
  get deploymentScript() {
    try {
      return path.dirname(require.resolve(`@deployment/deploymentScript/package.json`))
    } catch (error) {
      // skip - in case not required 
    }
  },
}

module.exports = function() {
  return [
    {
      type: 'directory',
      path: `${resolvedModule.deploymentScript}/script`,
    },
  ]
}
