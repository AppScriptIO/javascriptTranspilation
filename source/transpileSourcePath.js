const util = require('util'),
  babel = require('@babel/core'),
  childProcess = require('child_process'),
  path = require('path'),
  { promises: filesystem } = require('fs')
// instead of reimplementing babel transform for directories using programmatic api, the cli that has this feature will be used.
const babelTransformFile = util.promisify(babel.transformFile),
  childProcessSpawn = util.promisify(childProcess.spawn)

/**
 * cli tool will be used instead of the babel programmatic api.
 * https://github.com/babel/babel/blob/master/packages/babel-cli/src/babel/dir.js#L13
 * https://github.com/babel/babel/tree/master/packages/babel-cli/src/babel
 * https://babeljs.io/docs/en/babel-cli
 * 
 * Similar to: 
 ```
  yarn run babel --out-dir ./distribution/ "./package.json" --config-file "./configuration/babel.config.js" --copy-files
 ```
 */
async function transpileSourcePath({ source, destination, basePath }) {
  // relative to root.
  if (!path.isAbsolute(source)) source = path.join(basePath, source)

  let fileStat = await filesystem.lstat(source).catch(error => (error.code == 'ENOENT' ? false : console.error(error)))
  // destination should include directory
  if (fileStat) {
    if (fileStat.isFile()) destination = destination
    else if (fileStat.isDirectory()) destination = path.join(destination, path.relative(basePath, source))
  } else return // return if source doesn't exist

  // execute babel cli
  let cp = childProcess.spawnSync(
    'yarn',
    [
      'run',
      'babel',
      '--out-dir',
      `"${destination}"`,
      '--config-file',
      '"./configuration/babel.config.js"',
      '--ignore',
      '"**/node_modules/**/*"',
      '--copy-files --include-dotfiles', // TODO: Notes: copy-files flag does not respect "ignore" flag. The build will complete only that the process takes more time.
      `"${path.relative(basePath, source)}"`,
    ],
    {
      cwd: basePath,
      shell: true,
      stdio: ['inherit', 'inherit', 'inherit'],
    },
  )
}

// yarn run babel --our-dir "./distribution" --config-file "./configuration/babel.config.js" --copy-files "./source"

module.exports = { transpileSourcePath }
