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
    var chip = instanceChip(instance);
    var assignments = instanceAssignments(instance);

    Evaluator.evaluate(chip, assignments);
  };

  var instanceChip = function (instance) {
    var edges = instance.outEdges;

    var chipEdge = _.detect(edges, function (edge) {
      return edge.destination.value.type === "chip";
    });

    return chipEdge.destination;
  };

  var instanceAssignments = function (instance) {
    return _.map(pinEdges(instance), function (edge) {
      var pin = edge.destination;
      var pinName = pin.value.name;

      var pinAssignment = _.detect(assignments, function (assignment) {
        return assignment.left === pinName;
      });

      if (!pinAssignment) {
        var error = "Could not find assignment for pin '" + pinName + "'";
        error += " in chip '" + chip.value.name + "'";
        throw new Error(error);
      }

      return { left: edge.value.name, right: pinAssignment.right };
    });
  };

  var pinEdges = function (instance) {
    var edges = instance.outEdges;

    return _.reject(edges, function (edge) {
      return edge.destination.value.type === "chip";
    });
  };
};

Evaluator.evaluate = function (chip, assignments) {
  new Evaluator(chip, assignments).evaluate();
};

module.exports = Evaluator;
