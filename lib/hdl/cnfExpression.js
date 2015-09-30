"use strict";

var CNFExpression = function () {
  this.conjunctions = [];
};

CNFExpression.Conjunction = function () {
  this.disjunctions = [];
};

CNFExpression.Disjunction = function () {
  this.terms = [];
};

CNFExpression.Literal = function () {};
CNFExpression.Negation = function () {};

module.exports = CNFExpression;
