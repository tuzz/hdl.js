"use strict";

var _ = require("underscore");

var LookupEvaluator = function (chip, assignments) {
  var self = this;

  self.evaluate = function () {
    if (lookupSuccessful()) {
      _.each(variableAssignments(), function (assignment) {
        if (assignment.left === "true") {
          assignment.right.value = true;
        }
        else {
          assignment.right.value = false;
        }
      });
    }
  };

  var lookupSuccessful = function () {
    return _.all(booleanAssignments(), function (assignment) {
      return assignment.left === "true" && assignment.right.value === true ||
        assignment.left === "false" && assignment.right.value === false;
    });
  };

  var booleanAssignments = function () {
    return _.select(assignments, function (assignment) {
      return assignment.right.value === true ||
        assignment.right.value === false;
    });
  };

  var variableAssignments = function () {
    return _.select(assignments, function (assignment) {
      return assignment.right.value !== true &&
        assignment.right.value !== false;
    });
  };
};

LookupEvaluator.evaluate = function (chip, assignments) {
  new LookupEvaluator(chip, assignments).evaluate();
};

module.exports = LookupEvaluator;
