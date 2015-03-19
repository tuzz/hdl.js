"use strict";

var Graph = require("./parser/graph");
var _ = require("underscore");

module.exports = function () {
  var self = this;
  self.graph = new Graph();

  self.addChip = function (name, graph) {
    var chip = findChip(graph, name);

    self.graph.addNode(chip);
    eachDescendant(chip, function (edge, node) {
      self.graph.addNode(node);
      self.graph.addEdge(edge);
    });
  };

  self.removeChip = function (name) {
    var chip = findChip(self.graph, name);
    if (!chip) { return; }

    eachDescendant(chip, function (edge, node) {
      self.graph.removeEdge(edge);
      if (isDisconnected(node)) { self.graph.removeNode(node); }
    });
    self.graph.removeNode(chip);
  };

  var findChip = function (graph, name) {
    return graph.findBy({ type: "chip", name: name });
  };

  var eachDescendant = function (node, callback) {
    var edges = node.outEdges.slice(0);

    _.each(edges, function (edge) {
      eachDescendant(edge.destination, callback);
      callback(edge, edge.destination);
    });
  };

  var isDisconnected = function (node) {
    return node.inEdges.length === 0 && node.outEdges.length === 0
  };

};
