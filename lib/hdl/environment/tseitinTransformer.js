"use strict";

var CNFCompiler = require("../cnfCompiler");
var _ = require("underscore");

var TseitinTransformer = function (environment) {
  var self = this;
  var graph = environment.graph;
  var transformedChips = [];

  self.transform = function (chipName) {
    var chip = graph.findBy({ name: chipName });

    transformBooleanChip();

    if (transformable(chip)) {
      var expression = CNFCompiler.compile(chipName, environment);
      chip.value.cnfExpression = expression;
      transformedChips.push(chip);

      _.each(dependeeChips(chip), function (dependee) {
        if (!contains(transformedChips, dependee)) {
          self.transform(dependee.value.name);
        }
      });
    }
  };

  var transformBooleanChip = function () {
    var booleanChip = graph.findBy({ name: "boolean", type: "chip" });

    if (!booleanChip || booleanChip.cnfExpression) {
      return;
    }

    var expression = CNFCompiler.compile("boolean", environment);
    booleanChip.value.cnfExpression = expression;
  };

  var transformable = function (chip) {
    return _.all(dependentChips(chip), function (c) {
      return isConcrete(c) || isLookup(c) || isBoolean(c);
    });
  };

  var dependentChips = function (chip) {
    var instances = _.map(chip.outEdges, function (edge) {
      return edge.destination;
    });

    var chipEdges = _.map(instances, function (instance) {
      var edges = instance.outEdges;
      return _.detect(edges, function (edge) {
        return edge.destination.value.type === "chip";
      });
    });

    return _.map(chipEdges, function (edge) {
      return edge.destination;
    });
  };

  var isConcrete = function (chip) {
    return chip.outEdges.length > 0;
  };

  var isBoolean = function (chip) {
    return chip.value.name === "boolean";
  };

  var isLookup = function (chip) {
    return chip.value.name === "lookup";
  };

  var contains = function (array, element) {
    return array.indexOf(element) > -1;
  };

  var dependeeChips = function (chip) {
    return _.uniq(_.map(chip.inEdges, function (edge) {
      var instance = edge.source;
      return instance.inEdges[0].source;
    }));
  };
};

TseitinTransformer.transform = function (chipName, environment) {
  new TseitinTransformer(environment).transform(chipName);
};

module.exports = TseitinTransformer;
