/**
 * Example:
 * basePath = `/x/y/`
 * targetPath = `/x/y/z/t.js`
 * --> `/z/t.js`
 */
function removeMatchingStringFromBeginning({ basePath, targetPath }) {
  let filenameArray = targetPath.split('/').filter(n => n)
  let rootPathArray = basePath.split('/').filter(n => n)
  let beggingMatch = true,
    index = 0
  while (beggingMatch && filenameArray.length >= index && rootPathArray.length >= index) {
    if (filenameArray[index] == rootPathArray[index]) filenameArray[index] = null
    else beggingMatch = false
    index++
  }
  return filenameArray.join('/')
}

module.exports = { removeMatchingStringFromBeginning }
