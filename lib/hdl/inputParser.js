"use strict";

var InputParser = function (options) {
  options = options || {};

  var PEG     = require("pegjs");
  var fs      = require("fs");
  var path    = [__dirname, "inputParser", "grammar.pegjs"].join("/");
  var grammar = fs.readFileSync(path).toString();

  return PEG.buildParser(grammar, options);
};

InputParser.parse = function (input) {
  var inputParser = new InputParser();
  return inputParser.parse(input);
}

module.exports = InputParser;
