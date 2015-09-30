"use strict";

var _ = require("underscore");

var CNFExpression = function () {
  this.conjunctions = [];

  this.toString = function () {
    var conjunctions = _.map(this.conjunctions, function (conjunction) {
      return conjunction.toString();
    });

    return conjunctions.join(" && ");
  };
};

CNFExpression.Conjunction = function () {
  this.disjunctions = [];

  this.toString = function () {
    var disjunctions = _.map(this.disjunctions, function (disjunction) {
      return disjunction.toString();
    });

    var string = disjunctions.join(" || ");

    if (disjunctions.length > 1) {
      return "(" + string + ")";
    }
    else {
      return string;
    }
  };
};

CNFExpression.Disjunction = function () {
  this.toString = function () {
    if (this.isNegation) {
      return "!" + this.value;
    }
    else {
      return this.value;
    }
  };
};

module.exports = CNFExpression;
