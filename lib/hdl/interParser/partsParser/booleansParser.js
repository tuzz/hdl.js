"use strict";

var Graph = require("../../graph");
var _ = require("underscore");

var BooleansParser = function (inter, graph) {
  var buildBoolean, buildTrue, buildFalse;

  this.parse = function () {
    figureOutWhatToBuild();

    if (buildBoolean) {
      var bool = new Graph.Node({ type: "chip", name: "boolean" });
      var instance = new Graph.Node({ type: "instance", name: "instance-b" });

      graph.addNode(bool);
      graph.addNode(instance);
      graph.addEdge(new Graph.Edge(instance, bool));

      if (buildTrue) {
        var truePin = new Graph.Node({ type: "intermediate", name: "true" });
        graph.addNode(truePin);
        graph.addEdge(new Graph.Edge(instance, truePin, { name: "true" }));
      }

      if (buildFalse) {
        var falsePin = new Graph.Node({ type: "intermediate", name: "false" });
        graph.addNode(falsePin);
        graph.addEdge(new Graph.Edge(instance, falsePin, { name: "false" }));
      }
    }
  };

  var figureOutWhatToBuild = function () {
    _.each(inter.parts, function (part) {
      var wires = part[1];
      _.each(wires, function (wire) {
        var variable = wire[1];

        if (variable === true) {
          buildBoolean = true;
          buildTrue = true;
        }
        else if (variable === false) {
          buildBoolean = true;
          buildFalse = true;
        }
      });
    });
  };

};

BooleansParser.parse = function (inter, graph) {
  new BooleansParser(inter, graph).parse();
};

module.exports = BooleansParser;
