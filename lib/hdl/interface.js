"use strict";

var _ = require("underscore");

module.exports = function (chip) {
  var self = this;

  var instances = _.map(chip.outEdges, function (edge) {
    return edge.destination;
  });

  var edges = _.flatten(
    _.map(instances, function (instance) {
      return instance.outEdges;
    })
  );

  var destinations = _.map(edges, function (edge) {
    return edge.destination;
  });

  var inputPins = _.uniq(
    _.select(destinations, function (destination) {
      return destination.value.type === "input";
    })
  );

  var outputPins = _.uniq(
    _.select(destinations, function (destination) {
      return destination.value.type === "output";
    })
  );

  var intermediatePins = _.uniq(
    _.select(destinations, function (destination) {
      return destination.value.type === "intermediate";
    })
  );

  self.inputs = _.map(inputPins, function (pin) {
    return pin.value.name;
  });

  self.outputs = _.map(outputPins, function (pin) {
    return pin.value.name;
  });

  self.intermediates = _.map(intermediatePins, function (pin) {
    return pin.value.name;
  });
};
