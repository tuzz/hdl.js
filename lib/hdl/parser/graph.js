"use strict";

var _ = require("underscore");

module.exports = function () {
  var self = this;

  self.nodes = [];
  self.edges = [];

  self.addNode = function (node) {
    self.nodes.push(node);
  };

  self.removeNode = function (node) {
    remove(self.nodes, node);

    _.each(node.inEdges,  function (edge) { self.removeEdge(edge); });
    _.each(node.outEdges, function (edge) { self.removeEdge(edge); });
  };

  self.addEdge = function (edge) {
    self.edges.push(edge);

    edge.source.outEdges.push(edge);
    edge.destination.inEdges.push(edge);
  };

  self.removeEdge = function (edge) {
    remove(self.edges, edge);

    if (edge.source) { remove(edge.source.outEdges, edge); }
    if (edge.destination) { remove(edge.destination.inEdges, edge); }
  };

  self.findBy = function (properties) {
    return _.detect(self.nodes, function (node) {
      return _.isMatch(node.value, properties);
    });
  };

  var remove = function (array, element) {
    var index = array.indexOf(element);
    array.splice(index, 1);
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
