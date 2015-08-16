"use strict";

var InputParser = function (options) {
  options = options || {};

  var PEG     = require("pegjs");
  var fs      = require("fs");
  var grammar = fs.readFileSync(
    __dirname + "/inputParser/grammar.pegjs",
    "utf8"
  );

  return PEG.buildParser(grammar, options);
};

InputParser.parse = function (input) {
  var inputParser = new InputParser();
  return inputParser.parse(input);
};

module.exports = InputParser;
