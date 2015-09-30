"use strict";

var TruthTableCNFCompiler = require("./cnfCompiler/truthTableCNFCompiler");
var _ = require("underscore");

var CNFCompiler = function (environment) {
  var self = this;
  var graph = environment.graph;

  self.compile = function (chipName) {
    var chip = graph.findBy({ name: chipName });

    if (isTruthTableChip(chip)) {
      return TruthTableCNFCompiler.compile(chipName, environment);
    }
    else {
      return "not implemented yet";
    }
  };

  var isTruthTableChip = function (chip) {
    var instance = chip.outEdges[0].destination;

    var chipEdge = _.detect(instance.outEdges, function (edge) {
      return edge.destination.value.type === "chip";
    });

    return chipEdge.destination.value.name === "lookup";
  };
};

CNFCompiler.compile = function (chipName, environment) {
  return new CNFCompiler(environment).compile(chipName);
};

module.exports = CNFCompiler;
