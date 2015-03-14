"use strict";

var _ = require("underscore");
var Graph = require("./graph");

var InterParser = function (inter) {
  var graph;

  this.parse = function () {
    graph = new Graph();

    _.each(inputNodes,  function (n) { graph.addNode(n); });
    _.each(outputNodes, function (n) { graph.addNode(n); });

    if (inter.table) {
      graph.addNode(lookupNode);
      _.each(inter.table, parseTable);
    }

    return graph;
  };

  var parseTable = function (row, index) {
    var instance = new Graph.Node({
      type: "instance",
      name: "instance-" + index
    });
    graph.addNode(instance);

    var edge = new Graph.Edge(instance, lookupNode);
    graph.addEdge(edge);

    _.each(row, function (cell) {
      parseTableRow(cell, instance);
    });
  };

  var parseTableRow = function (cell, instance) {
    var pinName = cell[0];
    var edgeValue = cell[1];
    var pin = findPin(pinName);

    var edge = new Graph.Edge(instance, pin, edgeValue);
    graph.addEdge(edge);
  };

  var inputNodes = (function () {
    return _.map(inter.inputs, function (name) {
      return new Graph.Node({
        type: "input",
        name: name
      });
    });
  })();

  var outputNodes = (function () {
    return _.map(inter.outputs, function (name) {
      return new Graph.Node({
        type: "output",
        name: name
      });
    });
  })();

  var lookupNode = (function () {
    return new Graph.Node({
      type: "chip",
      name: "lookup"
    });
  })();

  var findPin = function (name) {
    var pinNodes = inputNodes.concat(outputNodes);
    return _.detect(pinNodes, function (n) { return n.value.name === name; });
  };
};

InterParser.parse = function (inter) {
  var interParser = new InterParser(inter);
  return interParser.parse();
};

module.exports = InterParser;
