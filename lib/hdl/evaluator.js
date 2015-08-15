"use strict";

var _ = require("underscore");
var LookupEvaluator = require("./evaluator/lookupEvaluator");

var Evaluator = function (chip, assignments) {
  var self = this;

  self.evaluate = function () {
    if (chip.value.name === "lookup") {
      LookupEvaluator.evaluate(chip, assignments);
    }
    else {
      _.each(chip.outEdges, function (edge) {
        var instance = edge.destination;
        evaluateInstance(instance);
      });
    }
  };

  var evaluateInstance = function (instance) {
    var edges = instance.outEdges;
    var instanceChip = edges[0].destination;
    var pinEdges = edges.slice(1, edges.length);

    var instanceAssignments = _.map(pinEdges, function (edge) {
      var pin = edge.destination;
      var pinName = pin.value.name;

      var pinAssignment = _.detect(assignments, function (assignment) {
        return assignment.left === pinName;
      });

      return { left: edge.value, right: pinAssignment.right };
    });

    Evaluator.evaluate(instanceChip, instanceAssignments);
  };
};

Evaluator.evaluate = function (chip, assignments) {
  new Evaluator(chip, assignments).evaluate();
};

module.exports = Evaluator;
