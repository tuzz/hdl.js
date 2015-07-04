"use strict";

var _ = require("underscore");

var TopoSorter = function (environment) {
  var self = this;
  var graph = environment.graph;
  var sortedChips = [];

  self.sort = function (chipName) {
    var chip = graph.findBy({ name: chipName });

    if (hasConcreteDependencies(chip)) {
      var knownPinNames = names(allInputPins(chip));
      var currentInstances = instances(chip);
      var orderedInstances = [];

      while (orderedInstances.length < currentInstances.length) {
        var instance = nextComputableInstance(
          currentInstances,
          orderedInstances,
          knownPinNames
        );

        if (!instance) {
          throw new Error("TODO");
        }

        appendKnownPins(instance, knownPinNames);
        orderedInstances.push(instance);
      }

      _.each(chip.outEdges, function (edge, index) {
        edge.destination = orderedInstances[index];
      });

      sortedChips.push(chip);
    }

    _.each(dependeeChips(chip), function (dependee) {
      if (!contains(sortedChips, dependee)) {
        self.sort(dependee.value.name);
      }
    });
  };

  var instances = function (chip) {
    return _.map(chip.outEdges, function (edge) {
      return edge.destination;
    });
  };

  var hasConcreteDependencies = function (chip) {
    return _.all(instances(chip), function (instance) {
      return isConcrete(instance);
    });
  };

  var allInputPins = function (chip) {
    return _.uniq(_.flatten(_.map(instances(chip), function (instance) {
      return inputPins(instance);
    })));
  };

  var allOutputPins = function (chip) {
    return _.uniq(_.flatten(_.map(instances(chip), function (instance) {
      return outputPins(instance);
    })));
  };

  var nextComputableInstance = function (current, ordered, knownPinNames) {
    return _.detect(current, function (instance) {
      return !contains(ordered, instance) &&
        isComputable(instance, knownPinNames);
    });
  };

  var isComputable = function (instance, knownPinNames) {
    var dependentChip = findChip(instance);
    var dependentInputs = allInputPins(dependentChip);
    var inputPinNames = dependentPinNames(instance, dependentInputs);

    return _.all(inputPinNames, function (pinName) {
      return contains(knownPinNames, pinName);
    });
  };

  var appendKnownPins = function (instance, knownPinNames) {
    var dependentChip = findChip(instance);
    var dependentOutputs = allOutputPins(dependentChip);
    var outputPinNames = dependentPinNames(instance, dependentOutputs);

    _.each(outputPinNames, function (pinName) {
      if (!contains(knownPinNames, pinName)) {
        knownPinNames.push(pinName);
      }
    });
  };

  var dependentPinNames = function (instance, dependentPins) {
    var pinNames = names(dependentPins);

    return _.compact(_.map(instance.outEdges, function (edge) {
      if (!edge.value) {
        return;
      }

      if (!contains(pinNames, edge.value.name)) {
        return;
      }

      var pin = edge.destination;
      return pin.value.name;
    }));
  };

  var isConcrete = function (instance) {
    var chip = findChip(instance);
    return chip.outEdges.length > 0;
  };

  var inputPins = function (instance) {
    return _.select(nodes(instance), function (node) {
      return node.value.type === "input";
    });
  };

  var outputPins = function (instance) {
    return _.select(nodes(instance), function (node) {
      return node.value.type === "output";
    });
  };

  var findChip = function (instance) {
    return _.detect(nodes(instance), function (node) {
      return node.value.type === "chip";
    });
  };

  var nodes = function (instance) {
    return _.map(instance.outEdges, function (edge) {
      return edge.destination;
    });
  };

  var contains = function (array, element) {
    return array.indexOf(element) > -1;
  };

  var names = function (array) {
    return _.map(array, function (element) {
      return element.value.name;
    });
  };

  var dependeeChips = function (chip) {
    return _.uniq(_.map(chip.inEdges, function (edge) {
      var instance = edge.source;
      return instance.inEdges[0].source;
    }));
  };
};

TopoSorter.sort = function (chipName, environment) {
  new TopoSorter(environment).sort(chipName);
};

module.exports = TopoSorter;
