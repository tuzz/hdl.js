"use strict";

var Graph = require("./graph");
var SubgraphConnector = require("./environment/subgraphConnector");
var TopoSorter = require("./environment/topoSorter");
var TseitinTransformer = require("./environment/tseitinTransformer");
var _ = require("underscore");

module.exports = function () {
  var self = this;
  self.graph = new Graph();

  self.addChip = function (name, graph) {
    self.removeChip(name);

    graph = graph.clone();
    var chip = findChip(graph, name);

    self.graph.addNode(chip);
    eachDescendant(chip, function (edge, node) {
      self.graph.addNode(node);
      self.graph.addEdge(edge);
    });

    SubgraphConnector.connect(self.graph);
    TopoSorter.sort(name, self);
    TseitinTransformer.transform(name, self);
  };

  self.removeChip = function (name) {
    var chip = findChip(self.graph, name);
    if (!chip) { return; }

    eachDescendant(chip, function (edge, node) {
      self.graph.removeEdge(edge);
      if (isDisconnected(node)) { self.graph.removeNode(node); }
    });

    if (isDisconnected(chip)) { self.graph.removeNode(chip); }
  };

  var findChip = function (graph, name) {
    return graph.findBy({ type: "chip", name: name });
  };

  var eachDescendant = function (node, callback) {
    var edges = node.outEdges.slice(0);

    _.each(edges, function (edge) {
      var next = edge.destination;

      if (!isChip(next)) {
        eachDescendant(next, callback);
      }

      callback(edge, next);
    });
  };

  var isChip = function (node) {
    return node.value.type === "chip";
  };

  var isDisconnected = function (node) {
    return node.inEdges.length === 0 && node.outEdges.length === 0;
  };

};
