"use strict";

var hdl = "../../../../lib/hdl";

var Graph = require(hdl + "/graph");
var describedClass = require(hdl + "/interParser/partsParser/booleansParser");

describe("BooleansParser", function () {
  it("introduces a boolean chip to set intermediate pins", function () {
    var graph = new Graph();
    describedClass.parse({
      inputs: ["in"],
      outputs: ["out"],
      parts: [
        ["foo", [["a", true]]],
        ["bar", [["b", true]]],
        ["baz", [["c", false]]]
      ]
    }, graph);

    var instance = graph.findBy({ name: "instance-b" });
    var edges = instance.outEdges;

    expect(edges[0].value).toBeUndefined();
    expect(edges[1].value).toEqual({ name: "true" });
    expect(edges[2].value).toEqual({ name: "false" });

    var bool     = edges[0].destination;
    var truePin  = edges[1].destination;
    var falsePin = edges[2].destination;

    expect(bool.value).toEqual({
      type: "chip",
      name: "boolean"
    });

    expect(truePin.value).toEqual({
      type: "intermediate",
      name: "true"
    });

    expect(falsePin.value).toEqual({
      type: "intermediate",
      name: "false"
    });
  });

  it("only introduces the boolean chip when needed", function () {
    var graph = new Graph();
    describedClass.parse({
      inputs: ["in"],
      outputs: ["out"],
      parts: [
        ["foo", [["a", "b"]]]
      ]
    }, graph);

    var instance = graph.findBy({ name: "instance-b" });
    expect(instance).toBeUndefined();
  });

  it("only introduces an intermediate pin when needed", function () {
    var graph = new Graph();
    describedClass.parse({
      inputs: ["in"],
      outputs: ["out"],
      parts: [
        ["foo", [["a", true]]]
      ]
    }, graph);

    var truePin = graph.findBy({ type: "intermediate", name: "true" });
    var falsePin = graph.findBy({ type: "intermediate", name: "false" });

    expect(truePin).toBeDefined();
    expect(falsePin).toBeUndefined();
  });
});
