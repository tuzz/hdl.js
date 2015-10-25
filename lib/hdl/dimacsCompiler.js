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

  console.log("p cnf " + numberOfVariables + " " + numberOfClauses);

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

    console.log(line + "0");
  });

  console.log("\nc Variable mappings:");
  _.each(variables, function (number, variable) {
    console.log("c " + number + " -> " + variable);
  });
};
