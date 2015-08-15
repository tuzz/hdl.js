/*jshint -W024 */

"use strict";

var Environment = require("./hdl/environment");
var Parser = require("./hdl/parser");
var Interface = require("./hdl/interface");

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
