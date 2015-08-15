/*jshint -W024 */

"use strict";

var Environment = require("./hdl/environment");
var Parser = require("./hdl/parser");
var Interface = require("./hdl/interface");
var Evaluator = require("./hdl/evaluator");
var DotCompiler = require("./hdl/dotCompiler");
var _ = require("underscore");

var Singleton = function () {
  var self = this;
  var environment;

  self.reset = function () {
    environment = new Environment();
  };

  self.define = function (name, definition) {
    var chip = Parser.parse(name, definition);
    environment.addChip(name, chip);
  };

  self.undefine = function (name) {
    environment.removeChip(name);
  };

  self.interface = function (name) {
    var chip = findChip(name);
    return new Interface(chip);
  };

  self.evaluate = function (name, expression) {
    var chip = findChip(name);
    var outputs = new Interface(chip).outputs;

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

  self.toDot = function () {
    return DotCompiler.compile(environment.graph);
  };

  var findChip = function (name) {
    var chip = environment.graph.findBy({ type: "chip", name: name });

    if (!chip) {
      throw new Error("Could not find the chip called '" + name + "'");
    }

    return chip;
  };

  self.reset();
};

module.exports = new Singleton();
