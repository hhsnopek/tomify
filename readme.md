# Tomify
> Replace faces in an image with Tom wiggle or your own Gif!

![tomified](examples/tomified.gif)

## Requirements
- [Imagemagick](//www.imagemagick.org)
- [OpenCV](//opencv.org/downloads.html) v2.4.x 

## CLI Usage
```
  Replace faces in image(s) with Tom wiggle or your own Gif!

  Usage: $ tomify <image>

  Options:
    --output, -o Output Path, default: $PWD
    --resize, -r Resize Tom, default: 1 (Number)
    --debug, -d Debug Mode, default: false
    --gif, -g Gif Path, default: tom-wiggle.gif
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
[MIT](license.md) © [Henry Snopek](//hhsnopek.com)
