"use strict";

var CNFExpression = function () {
  this.conjunctions = [];
};

CNFExpression.Conjunction = function () {
  this.disjunctions = [];
};

CNFExpression.Disjunction = function () {
};

module.exports = CNFExpression;
