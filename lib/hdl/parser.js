"use strict";

module.exports = function (options) {
  options = options || {};

  var PEG     = require("pegjs");
  var fs      = require("fs");
  var path    = [__dirname, "parser", "grammar.pegjs"].join("/");
  var grammar = fs.readFileSync(path).toString();

  return PEG.buildParser(grammar, options);
};
