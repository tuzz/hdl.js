"use strict";

var TruthTableCNFCompiler = require("./cnfCompiler/truthTableCNFCompiler");
var CNFExpression = require("./cnfExpression");
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
      var instances = _.map(chip.outEdges, function (edge) {
        return edge.destination;
      });

      var instanceExpressions = _.map(instances, function (instance) {
        return compileExpression(instance);
      });

      var expression = new CNFExpression();

      _.each(instanceExpressions, function (expr) {
        _.each(expr.conjunctions, function (conjunction) {
          expression.conjunctions.push(conjunction);
        });
      });

      return expression;
    }
  };

  var compileExpression = function (instance) {
    var edges = instance.outEdges;

    var chipEdge = _.detect(edges, function (e) {
      return e.destination.value.type === "chip";
    });

    var pinEdges = _.without(edges, chipEdge);

    var chip = chipEdge.destination;

    // TODO: The expression needs to be memoized onto the chip beforehand.
    // This will cause a combinatorial explosion.
    var expression = self.compile(chip.value.name);

    var mappedExpression = new CNFExpression();

    _.each(expression.conjunctions, function (conjunction) {
      var mappedConjunction = new CNFExpression.Conjunction();

      _.each(conjunction.disjunctions, function (disjunction) {
        var pinEdge = _.detect(pinEdges, function (edge) {
          return edge.value.name === disjunction.value;
        });

        var pin = pinEdge.destination;

        var mappedDisjunction = new CNFExpression.Disjunction();
        mappedDisjunction.value = pin.value.name;
        mappedDisjunction.isNegation = disjunction.isNegation;

        mappedConjunction.disjunctions.push(mappedDisjunction);
      });

      mappedExpression.conjunctions.push(mappedConjunction);
    });

    return mappedExpression;
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
