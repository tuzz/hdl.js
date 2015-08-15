"use strict";

var _ = require("underscore");

var Evaluator = function (chip, assignments) {
  var self = this;

  self.evaluate = function () {
    if (chip.name === "lookup") {
      if (lookupSuccessful()) {
        _.each(variableAssignments(), function (assignment) {
          assignment.right.value = assignment.left;
        });
      }
    }
  };

  var lookupSuccessful = function () {
    return _.all(booleanAssignments(), function (assignment) {
      return assignment.left === assignment.right;
    });
  };

  var booleanAssignments = function () {
    return _.select(assignments, function (assignment) {
      return assignment.right === true || assignment.right === false;
    });
  };

  var variableAssignments = function () {
    return _.select(assignments, function (assignment) {
      return assignment.right !== true && assignment.right !== false;
    });
  };
};

Evaluator.evaluate = function (chip, assignments) {
  new Evaluator(chip, assignments).evaluate();
};

module.exports = Evaluator;
