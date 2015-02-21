"use strict";

var Graph = require("./graph");

var InterParser = function (inter) {
  this.parse = function () {
    return new Graph();
  };
};

InterParser.parse = function (inter) {
  var interParser = new InterParser(inter);
  return interParser.parse();
}

module.exports = InterParser;
