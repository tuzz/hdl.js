"use strict";

var LookupEvaluator = require("./evaluator/lookupEvaluator");

var Evaluator = function (chip, assignments) {
  var self = this;

  self.evaluate = function () {
    if (chip.name === "lookup") {
      LookupEvaluator.evaluate(chip, assignments);
    }
    else {

    }
  };
};

Evaluator.evaluate = function (chip, assignments) {
  new Evaluator(chip, assignments).evaluate();
};

module.exports = Evaluator;
