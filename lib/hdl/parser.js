"use strict";

var InputParser = require("./parser/inputParser");
var InterParser = require("./parser/interParser");

module.exports.parse = function (name, input) {
  var inter = InputParser.parse(input);
  var graph = InterParser.parse(name, inter);

  return graph;
};
