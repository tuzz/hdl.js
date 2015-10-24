"use strict";

var _ = require("underscore");
var LookupEvaluator = require("./evaluator/lookupEvaluator");
var Interface = require("./interface");

var Evaluator = function (chip, assignments) {
  var self = this;
  var intermediateAssignments = {};

  self.evaluate = function () {
    if (chip.value.name === "lookup") {
      LookupEvaluator.evaluate(chip, assignments);
    }
    else if (chip.value.name === "boolean") {
      _.each(assignments, function (assignment) {
        if (assignment.left === "true") {
          assignment.right.value = true;
        }
        else {
          assignment.right.value = false;
        }
      });
    }
    else {
      if (chip.outEdges.length === 0) {
        throw new Error("Chip is not defined: " + chip.value.name);
      }

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
      var pinAssignment;

      if (pin.value.type === "intermediate") {
        pinAssignment = intermediateAssignment(pinName);
      }
      else {
        pinAssignment = findAssignment(pinName);
      }

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

  var findAssignment = function (pinName) {
    return _.detect(assignments, function (assignment) {
      return assignment.left === pinName;
    });
  };

  var intermediateAssignment = function (pinName) {
    var assignment = intermediateAssignments[pinName];

    if (!assignment) {
      assignment = {
        left: pinName,
        right: { name: pinName, type: "assignment" }
      };

      intermediateAssignments[pinName] = assignment;
    }

    return assignment;
  };
};

Evaluator.evaluate = function (chip, assignments) {
  new Evaluator(chip, assignments).evaluate();
};

// Convenience method to convert an expression into assignments.
Evaluator.evaluateExpression = function (chip, expression) {
  var outputs = _.map(new Interface(chip).outputs, function (output) {
    return output.name;
  });
  var assignments = [];

  _.each(expression, function (value, input) {
    assignments.push({
      left: input,
      right: { name: input, type: "assignment", value: value }
    });
  });

  _.each(outputs, function (output) {
    assignments.push({
      left: output,
      right: { name: output, type: "assignment" }
    });
  });

  Evaluator.evaluate(chip, assignments);

  var outputAssignments = _.select(assignments, function (assignment) {
    return _.any(outputs, function (output) {
      return output === assignment.left;
    });
  });

  var object = {};
  _.each(outputAssignments, function (assignment) {
    object[assignment.left] = assignment.right.value;
  });

  return object;
};

module.exports = Evaluator;
