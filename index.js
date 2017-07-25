#!/usr/local/bin/node

const fs = require('fs-extra')
const meow = require('meow')
const path = require('path')
const spawn = require('projector-spawn')
const promisify = require('util').promisify
const Faced = require('faced')
const faced = new Faced()

const cli = meow(
  `
  Usage: $ tomify <input>

  Options:
    --output, -o Output Path
    --resize, -r Resize Number, 1.25
    --debug, -d Debug

  Examples:
    $ tomify file1.jpg file2.jpg -o ./new-folder
`,
  {
    alias: { h: 'help', o: 'output', d: 'debug', r: 'resize' }
  }
)

/**
 * CLI
 */

if (cli.input.length === 0 && !cli.flags.input) {
  console.error('Specify at least one path')
  process.exit(1)
}
if (!cli.flags.resize) cli.flags.resize = 1
else if (typeof cli.flags.resize !== 'number') {
  console.error('resize must be a number')
  process.exit(1)
}

let dest = cli.flags.output || process.cwd()
fs.ensureDirSync(dest)
console.error('Destination: %s', dest)

/**
 * Build Toms
 */

const toms = []
for (let file of cli.input) {
  toms.push(
    new Promise((resolve, reject) =>
      findFace(file, dest).then(addTom).then(resolve).catch(reject)
    )
  )
}

Promise.all(toms)
  .then(() => console.log('Done!'))
  .catch(err => {
    if (err.stderr) console.error(err.stderr)
    else console.error(err)
    process.exit(err.code || 1)
  })

/**
 * Find all Faces
 */

function findFace(file, dest) {
  return new Promise((resolve, reject) => {
    debug('Processing %s...', file)
    faced.detect(file, (faces, image, file) => {
      if (faces.length === 0) {
        reject(new Error(`Faces not found in ${file}`))
        return
      }

      debug('Face face in %s...', file)
      const face = faces[0]
      const centerX = (face.getX() + (face.getWidth() / 2))
      const centerY = (face.getY() + (face.getHeight() / 2))
      const tomWidth = cli.flags.resize * (face.getWidth() * 1.75)
      const tomHeight = cli.flags.resize * (face.getHeight() * 1.75)
      const x = centerX - (tomWidth / 2)
      const y = centerY - (tomHeight / 2)
      resolve([dest, file, x, y, tomHeight, tomWidth])
    })
  })
}

/**
 * Add Tom to Image
 */

function addTom([dest, file, top, left, height, width]) {
  let meta = path.parse(file)
  dest = path.join(dest, `${meta.name}.gif`)
  console.error('Tomifying %s...', meta.base)
  return spawn(
    'convert',
    [
      file,
      'null:',
      '\(',
      path.join(__dirname, 'tom.gif'),
      '-resize',
      `${height}`,
      '\)',
      '-geometry',
      `+${top}+${left}`,
      '-layers',
      'composite',
      '-delete',
      0,
      '-loop',
      0,
      dest
    ],
    {
      cwd: process.cwd()
    }
  )
}

/**
 * Debug
 */

function debug(msg) {
  if (cli.flags.debug) console.error(msg)
}
