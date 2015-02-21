"use strict";

module.exports = function () {
  this.nodes = [];
  this.edges = [];

  this.addNode = function (node) {
    this.nodes.push(node);
  };

  this.addEdge = function (edge) {
    this.edges.push(edge);

    edge.source.outEdges.push(edge);
    edge.destination.inEdges.push(edge);
  };
};

module.exports.Node = function (value) {
  this.value = value;
  this.outEdges = [];
  this.inEdges = [];
};

module.exports.Edge = function (source, destination, value) {
  this.source = source;
  this.destination = destination;
  this.value = value;
};
