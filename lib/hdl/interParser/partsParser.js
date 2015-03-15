"use strict";

var _ = require("underscore");
var Graph = require("../graph");
var BooleansParser = require("./partsParser/booleansParser");
var VariableResolver = require("./variableResolver");
var WireResolver = require("./partsParser/wireResolver");

var PartsParser = function (inter, graph) {

  this.parse = function () {
    BooleansParser.parse(inter, graph);

    _.each(inter.parts, function (part, index) {
      var instance = parseInstance(index);
      var chip = parseChip(part);

      graph.addEdge(
        new Graph.Edge(instance, chip)
      );

      parseIntermediates(part);
      parseWires(part, instance);
    });
  };

  var parseInstance = function (index) {
    var instance = new Graph.Node({
      type: "instance",
      name: "instance-" + index
    });

    graph.addNode(instance);
    return instance;
  };

  var parseChip = function (part) {
    var chipName = part[0];
    var chip = findChip(chipName);

    if (!chip) {
      chip = new Graph.Node({
        type: "chip",
        name: chipName
      });

      graph.addNode(chip);
    }

    return chip;
  };

  var parseIntermediates = function (part) {
    var wires = part[1];

    _.each(wires, function (wire) {
      var variable = wire[1];

      var properties = _.extend(
        { type: "intermediate" },
        VariableResolver.resolve(variable)
      );

      var pin = findPin(properties.name);

      if (!pin) {
        graph.addNode(new Graph.Node(properties));
      }
    });
  };


  var parseWires = function (part, instance) {
    var wires = part[1];

    _.each(wires, function (wire) {
      parseWire(wire, instance);
    });
  };

  var parseWire = function (wire, instance) {
    var pinName = VariableResolver.resolve(wire[1]).name;
    var pin = findPin(pinName);
    var properties = WireResolver.resolve(wire);

    graph.addEdge(
      new Graph.Edge(instance, pin, properties)
    );
  };

  var findChip = function (name) {
    return graph.findBy({ type: "chip", name: name });
  };

  var findPin = function (name) {
    var input = graph.findBy({ type: "input", name: name });
    var output = graph.findBy({ type: "output", name: name });
    var intermediate = graph.findBy({ type: "intermediate", name: name });

    return input || output || intermediate;
  };

};

PartsParser.parse = function (inter, graph) {
  new PartsParser(inter, graph).parse();
};

module.exports = PartsParser;
