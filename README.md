# broccoli-bower

Proof-of-concept plugin for loading Bower packages into Broccoli.

## Warning

**This is pre-alpha software!**

At the moment, it's not well-specified where to pick up source files from
Bower packages. The top level is probably wrong; `lib` is often a good guess;
the `main` property in `bower.json` points at files too. This plugin uses
heuristics to pick the `lib` directory and/or `main` files, and returns an
array of trees-(hopefully)-containing-the-source-code for each bower package
found.

Because of that, this plugin should be regarded as a pre-alpha proof of
concept to demonstrate what might be possible when we combine Bower with a
build system sitting on top.

You should not rely no its behavior for your production apps, and you should
not rely on its behavior to distribute your libraries.

There will be many cases where the current heuristic results in broken or
undesirable behavior. This is acceptable. Please do not send pull requests to
change the behavior, as fixing one edge case will just open up another.

The way forward is to write a mini spec for a configuration syntax to specify
where in a bower package source files should be picked up, such as `{ mainDir:
'lib' }`. This configuration might be part of `bower.json`, or might live in a
separate file.

## Installation

```
npm --save-dev broccoli-bower
```

## Usage

```js
var findBowerTrees = require('broccoli-bower');

var bowerTrees = findBowerTrees();
```

Then pass `bowerTrees` into other plugins to have the files in your bower
packages picked up by them.
