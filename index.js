const { join, parse } = require('path')
const { promisify } = require('util')
const { exists } = require('fs-extra')
const spawn = require('projector-spawn')
const map = require('lodash.mapvalues')
const Faced = require('faced')

const existsAsync = promisify(exists)
const faced = new Faced()

/**
 * Find all Faces
 */

async function replaceAll({ file, dest, resize, gif }) {
  debug('Processing %s...', file)

  return await detect(file).then(async ({ faces, image, file }) => {
    debug('Found %s face(s) in %s...', faces.length, file)

    const positions = []
    map(faces, face => {
      // x
      const centerX = (face.getX() + (face.getWidth() / 2))
      const gifWidth = resize * (face.getWidth() * 1.75)
      const x = centerX - (gifWidth / 2)
      
      // y
      const centerY = (face.getY() + (face.getHeight() / 2))
      const gifHeight = resize * (face.getHeight() * 1.75)
      const y = centerY - (gifHeight / 2)

      positions.push({ x: parseInt(x), y: parseInt(y), height: parseInt(gifHeight), width: parseInt(gifWidth), gif })
    })

    await addGifs({ dest, file, positions })
  })
}

/**
 * Add Tom to Image
 */

async function addGifs({ dest, file, positions }) {
  return new Promise((resolve, reject) => {
    debug('Tomifying %s...', file)
    const queries = positions.reduce((queries, pos) => queries.concat(createQuery(pos)), [])
    spawn('convert', [file, ...queries, dest], {
      cwd: process.cwd()
    })
      .then(resolve)
      .catch(reject)
  })
}

/**
 * Async Detect
 */

function detect(file) {
  return new Promise((resolve, reject) => {
    faced.detect(file, (faces, image, file) => {
      if (faces.length === 0) {
        reject(new Error(`Faces not found in ${file}`))
        return
      }

      resolve({ faces, image, file })
    })
  })
}

/**
 * Create Imagemagick null query
 */

function createQuery({file, x, y, height, width, gif}) {
  return [
    'null:',
    '\(',
    gif,
    '-resize',
    `${height}x${width}`,
    '\)',
    '-geometry',
    `+${x}+${y}`,
    '-layers',
    'composite'
  ]
}

/**
 * Debug
 */

function debug(msg, ...args) {
  if (process.env.TOMIFY_DEBUG === 'true') console.error(msg, ...args)
}

module.exports = { replaceAll, addGifs, detect, createQuery, debug }
