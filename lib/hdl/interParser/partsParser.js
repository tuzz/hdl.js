"use strict";

var _ = require("underscore");
var Graph = require("../graph");

var PartsParser = function (inter, graph) {

  this.parse = function () {
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
      var pinName = wire[1];
      var pin = findPin(pinName);

      if (!pin) {
        graph.addNode(
          new Graph.Node({
            type: "intermediate",
            name: pinName
          })
        );
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
    var remotePinName = wire[0];
    var localPinName = wire[1];
    var localPin = findPin(localPinName);

    graph.addEdge(
      new Graph.Edge(instance, localPin, remotePinName)
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
