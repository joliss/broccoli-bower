# master

# 0.2.0

* Overwrite files in merged tree if `lib` and `"main"` files collide
* Ignore files in `bower_components`; we now only care about subdirectories
  (and symlinks to directories)
* Throw clearer error when the `main` bower property contains globs
* Only add package root if no `lib` and `"main"` files were found

# 0.1.0

* Initial release
