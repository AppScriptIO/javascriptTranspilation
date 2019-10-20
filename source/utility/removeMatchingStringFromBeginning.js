const path = require('path')

/**
 * Example:
 * basePath = `/x/y/`
 * targetPath = `/x/y/z/t.js`
 * --> `/z/t.js`
 */
function removeMatchingStringFromBeginning({ basePath, targetPath }) {
  let filenameArray = targetPath.split(path.sep).filter(n => n)
  let rootPathArray = basePath.split(path.sep).filter(n => n)
  let beginningMatch = true,
    index = 0
  while (beginningMatch && filenameArray.length >= index && rootPathArray.length >= index) {
    if (filenameArray[index] == rootPathArray[index]) filenameArray[index] = null
    else beginningMatch = false
    index++
  }
  
  filenameArray = filenameArray.filter(_ => Boolean(_)) // filter null
  
  return filenameArray.join(path.sep)
}

module.exports = { removeMatchingStringFromBeginning }
