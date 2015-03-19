"use strict";

var _ = require("underscore");
var Graph = require("../../parser/graph");

module.exports.redirect = function (graph, from, to) {
  var edges = from.inEdges.slice(0);

  _.each(edges, function (edge) {
    graph.addEdge(
      new Graph.Edge(edge.source, to, edge.value)
    );

    graph.removeEdge(edge);
  });
};
