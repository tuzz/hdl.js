"use strict";

var _ = require("underscore");

module.exports.compile = function (expression) {
  var variables = {};
  var nextLiteral = 1;

  _.each(expression.conjunctions, function (conjunction) {
    _.each(conjunction.disjunctions, function (disjunction) {
      if (!variables[disjunction.value]) {
        variables[disjunction.value] = nextLiteral;
        nextLiteral += 1;
      }
    });
  });

  var numberOfVariables = nextLiteral - 1;
  var numberOfClauses = expression.conjunctions.length;

  var output = "p cnf " + numberOfVariables + " " + numberOfClauses + "\n";

  _.each(expression.conjunctions, function (conjunction) {
    var line = "";

    _.each(conjunction.disjunctions, function (disjunction) {
      var index = variables[disjunction.value];

      if (disjunction.isNegation) {
        line += "-" + index + " ";
      }
      else {
        line += index + " ";
      }
    });

    output += line + "0\n";
  });

  output += "\nc Variable mappings:\n";
  _.each(variables, function (number, variable) {
    output += "c " + number + " -> " + variable + "\n";
  });

  return output;
};
