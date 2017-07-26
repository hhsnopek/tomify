# Tomify
![tomified](examples/tomified.gif)

## Requirements
- [Imagemagick](//www.imagemagick.org)

## CLI Usage
```
  Tomify an image!

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
```

## Internal API
### Usage
#### Replace all faces in a gif with your own gif
```
const gif = 'path/to/custom.gif'
const file = 'image/with/faces.jpg'
const dest = 'path/to/output.gif'
const reszie = 1

replaceAll({ file, dest, resize, gif })
  .then(() => {
    console.log('Done!')
  })
  .catch(err => {
    console.error('Uh oh!')
    console.error(err)
  })
```

### Reference
#### replaceAll
```
// Find and replace all Faces with gif
async function replaceAll({ file, dest, resize })

  // Params
  Object
    file = Filepath
    dest = Filepath
    resize = Integer
```

#### addGifs
```
// Adds a Gif to all all positions
async function addGifs({ dest, file, positions })

  // Params
  Object
    dest = Filepath
    file = Filepath
    positions = Array of Objects
      Object - {file, x, y, height, width, gif} // see createQuery for details
```

#### createQuery
```
// Creates an imagemagick query, used internally in addGifs
function createQuery({file, x, y, height, width, gif=defaultGif})

  // Params
  Object
    file = Filepath
    x = Integer
    y = Integer
    height = Integer
    width = Integer
    gif = Filepath

  // Returns Formatted Array
```

#### detect
```
// Async Detect - returns Promise
function detect(file)

  // Params
  file = Filepath

  // Returns
  Object
    faces = Array of Face (See faced)
    image = Matrix
    file = Filepath
```

#### debug
```
// Enables logging if environment variable TOMIFY_DEBUG is 'true'
// note: this is just a small wrapper to console.error
function debug(msg, ...args)

  // Params
  msg = String
  ...args
```

## Known Issues
- Running macOS 10.12 (Sierra)? See: https://github.com/Homebrew/homebrew-science/issues/4303

## License
MIT License

Copyright (c) 2017 Henry Snopek

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
