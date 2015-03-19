"use strict";

var _ = require("underscore");

module.exports = function () {
  var self = this;

  self.nodes = [];
  self.edges = [];

  self.addNode = function (node) {
    add(self.nodes, node);
  };

  self.removeNode = function (node) {
    if (_.any(node.inEdges) || _.any(node.outEdges)) {
      throw new Error("Unable to remove node because it is connected");
    }

    remove(self.nodes, node);
  };

  self.addEdge = function (edge) {
    add(self.edges, edge);

    add(edge.source.outEdges, edge);
    add(edge.destination.inEdges, edge);
  };

  self.removeEdge = function (edge) {
    remove(self.edges, edge);

    remove(edge.source.outEdges, edge);
    remove(edge.destination.inEdges, edge);
  };

  self.findBy = function (properties) {
    return _.detect(self.nodes, function (node) {
      return _.isMatch(node.value, properties);
    });
  };

  var add = function (array, element) {
    if (!contains(array, element)) {
      array.push(element);
    }
  };

  var remove = function (array, element) {
    if (contains(array, element)) {
      var index = array.indexOf(element);
      array.splice(index, 1);
    }
  };

  var contains = function (array, element) {
    return array.indexOf(element) > -1;
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
