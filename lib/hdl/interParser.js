"use strict";

var _ = require("underscore");
var Graph = require("./graph");
var TableParser = require("./interParser/tableParser");
var PartsParser = require("./interParser/partsParser");
var VariableResolver = require("./interParser/variableResolver");

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
    _.each(inter.inputs, function (variable) {
      var properties = _.extend(
        { type: "input" },
        VariableResolver.resolve(variable)
      );

      graph.addNode(new Graph.Node(properties));
    });
  };

  var parseOutputs = function () {
    _.each(inter.outputs, function (variable) {
      var properties = _.extend(
        { type: "output" },
        VariableResolver.resolve(variable)
      );

      graph.addNode(new Graph.Node(properties));
    });
  };

};

InterParser.parse = function (inter) {
  var interParser = new InterParser(inter);
  return interParser.parse();
};

module.exports = InterParser;
