#!/usr/local/bin/node

const fs = require('fs-extra')
const { join, parse } = require('path')

const meow = require('meow')
const { replaceAll, addTom, debug } = require('./')

const cli = meow(
  `
  Usage: $ tomify <image>

  Options:
    --output, -o Output Path, default: $PWD
    --resize, -r Resize Tom, default: 1 (Number)
    --debug, -d Debug Mode, default: false
    --help, -h Display Help
    --version Display Version

  Examples:
    $ tomify image.jpg
        # process single image and save to $PWD/image.gif

    $ tomify person1.jpg person2.jpg --output ./new-folder
        # process multiple images, and saves to ./new-folder
`,
  {
    alias: { h: 'help', o: 'output', d: 'debug', r: 'resize' }
  }
)

/**
 * CLI
 */

process.env.TOMIFY_DEBUG = cli.flags.debug ? 'true' : 'false'
if (cli.input.length === 0 && !cli.flags.input) {
  console.error('Specify at least one path')
  process.exit(1)
}

if (!cli.flags.resize) cli.flags.resize = 1
else if (typeof cli.flags.resize !== 'number') {
  console.error('resize must be a number')
  process.exit(1)
}
const resize = cli.flags.resize

let dest = cli.flags.output || process.cwd()
fs.ensureDirSync(dest)
debug('Destination: %s', dest)

/**
 * Build Toms
 */

const toms = []
cli.input.map(file => {
  toms.push(new Promise((resolve, reject) => {
    dest = join(dest, `${parse(file).name}.gif`)
    return replaceAll({ file, dest, resize }).then(resolve).catch(reject)
    })
  )
})

Promise.all(toms)
  .then(() => {
    debug('Done!')
    process.exit(0)
  })
  .catch(err => {
    if (err.stderr) console.error(err.stderr)
    else console.error(err)
    process.exit(err.code || 1)
  })

