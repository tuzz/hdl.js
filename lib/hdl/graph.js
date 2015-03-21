"use strict";

var _ = require("underscore");

var Graph = function () {
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

  self.where = function (properties) {
    return _.select(self.nodes, function (node) {
      return _.isMatch(node.value, properties);
    });
  };

  self.clone = function () {
    var clone = new Graph();

    _.each(self.nodes, function (node) {
      var _node = new Graph.Node(node.value);
      clone.addNode(_node);
    });

    _.each(self.edges, function (edge) {
      var _edge = new Graph.Edge(
        clone.nodes[self.nodes.indexOf(edge.source)],
        clone.nodes[self.nodes.indexOf(edge.destination)],
        edge.value
      );
      clone.addEdge(_edge);
    });

    return clone;
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

Graph.Node = function (value) {
  this.value = value;
  this.outEdges = [];
  this.inEdges = [];
};

Graph.Edge = function (source, destination, value) {
  this.source = source;
  this.destination = destination;
  this.value = value;
};

module.exports = Graph;
