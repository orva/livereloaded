const path = require("path");

module.exports = {
  entry: {
    "livereloaded.js": "./js/livereloaded.js",
    "options.js": "./js/options.js",
    "livereload-script-tag-injector.js":
      "./js/livereload-script-tag-injector.js"
  },
  output: {
    path: path.resolve(__dirname, "addon"),
    filename: "[name]"
  }
};
