"use strict";

var _ = require("underscore");
var Graph = require("../graph");

var TableParser = function (inter, graph) {

  this.parse = function () {
    var lookupNode = new Graph.Node({
      type: "chip",
      name: "lookup"
    });
    graph.addNode(lookupNode);

    _.each(inter.table, function (row, index) {
      parseRow(row, index, lookupNode);
    });
  };

  var parseRow = function (row, index, lookupNode) {
    var instance = new Graph.Node({
      type: "instance",
      name: "instance-" + index
    });
    graph.addNode(instance);

    graph.addEdge(
      new Graph.Edge(instance, lookupNode)
    );

    _.each(row, function (cell) {
      parseCell(cell, instance);
    });
  };

  var parseCell = function (cell, instance) {
    var pinName = cell[0];
    var edgeValue = cell[1];
    var pin = findPin(pinName);

    var edge = new Graph.Edge(instance, pin, edgeValue);
    graph.addEdge(edge);
  };

  var findPin = function (name) {
    var input = graph.findBy({ type: "input", name: name });
    var output = graph.findBy({ type: "output", name: name });

    return input || output;
  };

};

TableParser.parse = function (inter, graph) {
  new TableParser(inter, graph).parse();
};

module.exports = TableParser;
