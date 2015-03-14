"use strict";

var _ = require("underscore");
var Graph = require("./graph");
var TableParser = require("./interParser/tableParser");
var PartsParser = require("./interParser/partsParser");

var InterParser = function (inter) {
  var graph;

  this.parse = function () {
    graph = new Graph();

    parseInputs();
    parseOutputs();

    var parser = inter.table ? TableParser : PartsParser;
    parser.parse(inter, graph);

    return graph;
  };

  var parseInputs = function () {
    _.each(inter.inputs, function (name) {
      graph.addNode(
        new Graph.Node({
          type: "input",
          name: name
        })
      );
    });
  };

  var parseOutputs = function () {
    _.each(inter.outputs, function (name) {
      graph.addNode(
        new Graph.Node({
          type: "output",
          name: name
        })
      );
    });
  };
};

InterParser.parse = function (inter) {
  var interParser = new InterParser(inter);
  return interParser.parse();
};

module.exports = InterParser;
