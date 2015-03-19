"use strict";

var _ = require("underscore");
var EdgeRedirector = require("./edgeRedirector");

var SubgraphConnector = function (graph) {
  this.connect = function () {
    var groups = groupedDuplicates();

    _.each(groups, function (array) {
      var keepThis = chipToKeep(array);
      var removeThese = remove(array, keepThis);

      _.each(removeThese, function (removeThis) {
        EdgeRedirector.redirect(graph, removeThis, keepThis);
        graph.removeNode(removeThis);
      });
    });
  };

  var groupedDuplicates = function () {
    return _.groupBy(duplicates(), function (chip) {
      return chip.value.name;
    });
  };

  var remove = function (array, element) {
    var index = array.indexOf(element);
    array.splice(index, 1);
    return array;
  };

  var duplicates = function () {
    return _.select(chips(), function (chip) {
      var matches = graph.where({ type: "chip", name: chip.value.name });
      return matches.length > 1;
    });
  };

  var chips = function () {
    return graph.where({ type: "chip" });
  };

  var chipToKeep = function (chips) {
    var concreteChip = _.detect(chips, function (chip) {
      return chip.outEdges.length !== 0;
    });

    return concreteChip || chips[0];
  };
};

SubgraphConnector.connect = function (graph) {
  new SubgraphConnector(graph).connect();
};

module.exports = SubgraphConnector;
