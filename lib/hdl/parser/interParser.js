"use strict";

var _ = require("underscore");
var Graph = require("../graph");
var TableParser = require("./interParser/tableParser");
var PartsParser = require("./interParser/partsParser");
var VariableResolver = require("./interParser/variableResolver");

var InterParser = function (name, inter) {
  var graph;

  this.parse = function () {
    graph = new Graph();

    var chip = parseChip();

    parseInputs();
    parseOutputs();

    var parser = inter.table ? TableParser : PartsParser;
    parser.parse(chip, inter, graph);

    return graph;
  };

  var parseChip = function () {
    var chip = new Graph.Node({ type: "chip", name: name });
    graph.addNode(chip);
    return chip;
  };

  var parseInputs = function () {
    _.each(inter.inputs, function (variable) {
      var properties = _.extend(
        { type: "input" },
        VariableResolver.resolve(variable)
      );

      if (!properties.width) {
        properties.width = 1;
      }

      graph.addNode(new Graph.Node(properties));
    });
  };

  var parseOutputs = function () {
    _.each(inter.outputs, function (variable) {
      var properties = _.extend(
        { type: "output" },
        VariableResolver.resolve(variable)
      );

      if (!properties.width) {
        properties.width = 1;
      }

      graph.addNode(new Graph.Node(properties));
    });
  };

};

InterParser.parse = function (name, inter) {
  return new InterParser(name, inter).parse();
};

module.exports = InterParser;
