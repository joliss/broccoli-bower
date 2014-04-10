# broccoli-bower

Proof-of-concept plugin for loading Bower packages into Broccoli.

At the moment, it's not well-specified where to pick up source files from
Bower packages. The top level is probably wrong; `lib` is often a good guess;
the `main` property in `bower.json` points at files too.

This plugin uses heuristics to pick the `lib` directory or `main` files, and
returns an array of trees-(hopefully)-containing-the-source-code for each
bower package found.

There is a lot of breakage ahead as the heuristics will give way to
well-specced behavior. It is not wise to rely on this package's current
behavior for anything.

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
