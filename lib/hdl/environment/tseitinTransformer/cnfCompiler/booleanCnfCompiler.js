"use strict";

var CNFExpression = require("../cnfExpression");

module.exports.compile = function () {
  var expression = new CNFExpression();

  var trueConjunction = new CNFExpression.Conjunction();
  var falseConjunction = new CNFExpression.Conjunction();

  var trueDisjunction = new CNFExpression.Disjunction();
  var falseDisjunction = new CNFExpression.Disjunction();

  trueDisjunction.value = "true";
  trueDisjunction.isNegation = false;

  falseDisjunction.value = "false";
  falseDisjunction.isNegation = true;

  trueConjunction.disjunctions.push(trueDisjunction);
  falseConjunction.disjunctions.push(falseDisjunction);

  expression.conjunctions.push(trueConjunction);
  expression.conjunctions.push(falseConjunction);

  return expression;
};
