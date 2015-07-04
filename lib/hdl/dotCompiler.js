'use strict';

var _ = require('underscore');

var DotCompiler = function (graph) {
  var self = this;

  self.compile = function () {
    var output = 'digraph g {';

    _.each(graph.nodes, function (node) {
      var line = '\n' + nodeId(node);

      line += '[label="' + nodeLabel(node);
      line += '",shape="' + nodeShape(node);
      line += '",style="' + nodeStyle();
      line += '",color="' + nodeColor(node);

      line += '"]';
      output += line;
    });

    _.each(graph.edges, function (edge) {
      var sourceId = nodeId(edge.source);
      var destId = nodeId(edge.destination);

      var line = '\n' + sourceId + '->' + destId;
      line += '[label="' + edgeLabel(edge) + '"]';
      output += line;
    });

    output += '\n}\n';
    return output;
  };

  var nodeId = function (node) {
    var chip = nodeChip(node);
    var chipName = chip.value.name;
    var nodeType = node.value.type;
    var nodeName = node.value.name;

    var id = chipName + '_' + nodeType + '_' + nodeName;
    id = id.replace(/-/g, '_');

    return id;
  };

  var nodeLabel = function (node) {
    return node.value.name;
  };

  var nodeShape = function (node) {
    if (node.value.type === 'chip') {
      return 'box';
    }
    else {
      return 'oval';
    }
  };

  var nodeStyle = function () {
    return 'filled';
  };

  var nodeColor = function (node) {
    if (node.value.type === 'chip') {
      return 'orange';
    }
    else if (node.value.type === 'input') {
      return 'green';
    }
    else if (node.value.type === 'output') {
      return 'red';
    }
    else if (node.value.type === 'intermediate') {
      return 'yellow';
    }
    else if (node.value.type === 'instance') {
      return 'gray';
    }
  };

  var nodeChip = function (node) {
    var currentNode = node;

    while (currentNode.value.type !== 'chip') {
      currentNode = currentNode.inEdges[0].source;
    }

    return currentNode;
  };

  var edgeLabel = function (edge) {
    if (edge.value === true) {
      return 'true';
    }
    else if (edge.value === false) {
      return 'false';
    }
    else if (edge.value) {
      return edge.value.name;
    }
    else {
      return '';
    }
  };
};

DotCompiler.compile = function (graph) {
  return new DotCompiler(graph).compile();
};

module.exports = DotCompiler;
