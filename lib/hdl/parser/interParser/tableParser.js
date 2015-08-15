"use strict";

var _ = require("underscore");
var Graph = require("../../graph");

var TableParser = function (chip, inter, graph) {

  this.parse = function () {
    var lookup = parseLookup();

    _.each(inter.table, function (row, index) {
      parseRow(row, index, lookup);
    });
  };

  var parseLookup = function () {
    var chip = new Graph.Node({
      type: "chip",
      name: "lookup"
    });

    graph.addNode(chip);
    return chip;
  };

  var parseRow = function (row, index, lookup) {
    var instance = parseInstance(index);

    graph.addEdge(
      new Graph.Edge(instance, lookup)
    );

    _.each(row, function (cell) {
      parseCell(cell, instance);
    });
  };

  var parseInstance = function (index) {
    var instance = new Graph.Node({
      type: "instance",
      name: "instance-" + index
    });

    graph.addNode(instance);

    graph.addEdge(
      new Graph.Edge(chip, instance)
    );

    return instance;
  };

  var parseCell = function (cell, instance) {
    var pinName = cell[0];
    var edgeValue = cell[1];
    var pin = findPin(pinName);
    var properties = { name: edgeValue.toString() };

    var edge = new Graph.Edge(instance, pin, properties);
    graph.addEdge(edge);
  };

  var findPin = function (name) {
    var input = graph.findBy({ type: "input", name: name });
    var output = graph.findBy({ type: "output", name: name });

    return input || output;
  };

};

TableParser.parse = function (chip, inter, graph) {
  new TableParser(chip, inter, graph).parse();
};

module.exports = TableParser;
