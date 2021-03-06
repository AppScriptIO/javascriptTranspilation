const util = require('util'),
  babel = require('@babel/core'),
  childProcess = require('child_process'),
  path = require('path'),
  { promises: filesystem } = require('fs')
// instead of reimplementing babel transform for directories using programmatic api, the cli that has this feature will be used.
const babelTransform = util.promisify(babel.transformFile),
  childProcessSpawn = util.promisify(childProcess.spawn)
const { recursivelySyncFile } = require('@dependency/handleFilesystemOperation')

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

  await recursivelySyncFile({ source: source, destination: destination, copyContentOnly: true })

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
      // Note: a separate rsync step should be used if copying other files is required, as the functionality provided with the babel commandline is limited.
      // '--copy-files --include-dotfiles --no-copy-ignored', // Note: this will ignore only .js files, regardless of the regex including other types. Apply ignore regex to the copy-files functionality, this will cause ignore flag to affect babel and also non transpiled copied files.
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
