var fs = require('fs')
var path = require('path')
var mergeTrees = require('broccoli-merge-trees')
var Writer = require('broccoli-writer')
var helpers = require('broccoli-kitchen-sink-helpers')


// Almost the same as using a plain string for a tree; but unlike a plain
// string, Broccoli won't watch this
function UnwatchedTree (dir) { this.dir = dir }
UnwatchedTree.prototype.read = function (readTree) { return this.dir }
UnwatchedTree.prototype.cleanup = function () { }



MainFilePicker.prototype = Object.create(Writer.prototype)
MainFilePicker.prototype.constructor = MainFilePicker
function MainFilePicker (dir, mainFiles) {
  this.dir = dir
  this.mainFiles = mainFiles
}

MainFilePicker.prototype.write = function (readTree, destDir) {
  for (var i = 0; i < this.mainFiles.length; i++) {
    var mainFile = this.mainFiles[i]
    try {
      if (mainFile.indexOf('*') !== -1 || mainFile.indexOf('?') !== -1) {
        throw new Error('In ' + this.dir + ': Glob patterns in bower\'s `main` property are not allowed: ' + mainFile)
      }
      helpers.copyPreserveSync(
        path.join(this.dir, mainFile),
        path.join(destDir, path.basename(mainFile)))
    } catch (err) {
      if (err.code !== 'ENOENT') throw err
      throw new Error('In bower directory ' + this.dir + ': Cannot find file specified in bower `main` property: ' + mainFile)
    }
  }
}


module.exports = findBowerTrees
function findBowerTrees (bowerDir) {
  var bowerDir = bowerDir || require('bower-config').read().directory // note: this relies on cwd
  if (bowerDir == null) throw new Error('Bower did not return a directory')
  var entries = fs.readdirSync(bowerDir)
  var directories = entries.filter(function (f) {
    return fs.statSync(path.join(bowerDir, f)).isDirectory()
  })
  return directories.map(function (dir) {
    return treeFromDirectory(path.join(bowerDir, dir))
  })
}


var treeFromDirectory = function (dir) {
  // Guess some reasonable defaults
  var options = bowerOptionsForDirectory(dir)
  var treeOptions = {}
  if (options.main != null) {
    var main = options.main
    if (typeof main === 'string') main = [main]
    if (!Array.isArray(main)) throw new Error(dir + ': Expected `main` bower option to be array or string')
    treeOptions.main = main
  }

  // We may need to use multiple auxiliary tree objects to represent this
  // bower tree
  var trees = []

  // Terrible heuristics follow
  if (fs.existsSync(path.join(dir, 'lib'))) {
    trees.push(new UnwatchedTree(path.join(dir, 'lib')))
  }
  if (treeOptions.main) {
    trees.push(new MainFilePicker(dir, treeOptions.main))
  }
  if (trees.length === 0) {
    // Map repo root into namespace root. This is almost always wrong, but we
    // have it as a stop-gap.
    trees.push(new UnwatchedTree(dir))
  }

  if (trees.length === 1) {
    return trees[0]
  } else {
    return mergeTrees(trees, { overwrite: true })
  }

  function bowerOptionsForDirectory (dir) {
    var options = {}
    ;['.bower.json', 'bower.json'].forEach(function (fileName) {
      var json
      try {
        json = fs.readFileSync(path.join(dir, fileName))
      } catch (err) {
        if (err.code !== 'ENOENT') throw err
        return
      }
      var hash = JSON.parse(json) // should report file name on invalid JSON
      for (var key in hash) {
        if (hash.hasOwnProperty(key)) {
          options[key] = hash[key]
        }
      }
    })
    return options
  }
}
