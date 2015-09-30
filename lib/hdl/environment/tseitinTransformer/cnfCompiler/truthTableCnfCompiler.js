"use strict";

var CNFExpression = require("../cnfExpression");
var Interface = require("../../../interface");
var _ = require("underscore");

var TruthTableCNFCompiler = function (environment) {
  var self = this;
  var graph = environment.graph;

  self.compile = function (chipName) {
    var chip = graph.findBy({ name: chipName });

    var interf = new Interface(chip);
    var pins = interf.inputs.concat(interf.outputs);
    var pinNames = _.map(pins, function (pin) {
      return pin.name;
    });

    var remainingPinCombinations = subtract(
      allPinCombinations(pinNames),
      specifiedPinCombinations(chip, pinNames)
    );

    return buildExpression(remainingPinCombinations, pinNames);
  };

  var buildExpression = function (pinCombinations, pinNames) {
    var expression = new CNFExpression();

    _.each(pinCombinations, function (row) {
      var conjunction = new CNFExpression.Conjunction();

      _.each(row, function (bool, index) {
        var disjunction = new CNFExpression.Disjunction();
        disjunction.value = pinNames[index];
        disjunction.isNegation = bool;

        conjunction.disjunctions.push(disjunction);
      });

      expression.conjunctions.push(conjunction);
    });

    return expression;
  };

  var allPinCombinations = function (pinNames) {
    var numberOfPins = pinNames.length;
    var combinations = Math.pow(2, numberOfPins);
    var leftPad = new Array(numberOfPins + 1).join("0");
    var arrays = [];

    for (var i = 0; i < combinations; i += 1) {
      var binary = i.toString(2);
      var paddedBinary = (leftPad + binary).slice(-numberOfPins);
      var binaryArray = paddedBinary.split("");

      var array = _.map(binaryArray, function (bit) {
        return bit === "1";
      });

      arrays.push(array);
    }

    return arrays;
  };

  var specifiedPinCombinations = function (chip, pinNames) {
    return _.map(chip.outEdges, function (edge) {
      var instance = edge.destination;

      return _.map(pinNames, function (name) {
        var edges = instance.outEdges;

        var edge = _.detect(edges, function (e) {
          return e.destination.value.name === name;
        });

        return edge.value.name === "true";
      });
    });
  };

  var subtract = function (a, b) {
    return _.reject(a, function (aElement) {
      return _.any(b, function (bElement) {
        return _.isEqual(aElement, bElement);
      });
    });
  };
};

TruthTableCNFCompiler.compile = function (chipName, environment) {
  return new TruthTableCNFCompiler(environment).compile(chipName);
};

module.exports = TruthTableCNFCompiler;

