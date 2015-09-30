"use strict";

var _ = require("underscore");

module.exports.compile = function (expression) {
  var variables = [""];

  _.each(expression.conjunctions, function (conjunction) {
    _.each(conjunction.disjunctions, function (disjunction) {
      variables.push(disjunction.value);
    });
  });

  variables = _.uniq(variables);

  var numberOfVariables = variables.length - 1;
  var numberOfClauses = expression.conjunctions.length;

  var output = "p cnf " + numberOfVariables + " " + numberOfClauses + "\n";

  _.each(expression.conjunctions, function (conjunction) {
    _.each(conjunction.disjunctions, function (disjunction) {
      var index = variables.indexOf(disjunction.value);

      if (disjunction.isNegation) {
        output += "-" + index + " ";
      }
      else {
        output += index + " ";
      }
    });

    output += "0\n";
  });

  output += "\nc Variable mappings:\n";
  for (var i = 1; i < variables.length; i += 1) {
    output += "c " + i + " -> " + variables[i] + "\n";
  }

  return output;
};
