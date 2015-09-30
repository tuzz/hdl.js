/*jshint -W024 */

"use strict";

var Environment = require("./hdl/environment");
var Parser = require("./hdl/parser");
var Interface = require("./hdl/interface");
var Evaluator = require("./hdl/evaluator");
var DotCompiler = require("./hdl/dotCompiler");
var DIMACSCompiler = require("./hdl/dimacsCompiler");

var HDL = function () {
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
    return Evaluator.evaluateExpression(chip, expression);
  };

  self.toDot = function () {
    return DotCompiler.compile(environment.graph);
  };

  self.toCNF = function (chipName) {
    return findChip(chipName).value.cnfExpression;
  };

  self.toDIMACS = function (chipName) {
    var expression = self.toCNF(chipName);
    return DIMACSCompiler.compile(expression);
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

module.exports = new HDL();

if (typeof window !== "undefined") {
  window.HDL = module.exports;
}
