"use strict";

var describedClass = require("../../../lib/hdl/interParser");

describe("buses", function () {
  it("supports buses as part of the interface", function () {
    var graph = describedClass.parse("something", {
      inputs: [["a", 4], ["b", 4], "foo"],
      outputs: [["out", 4]],
      parts: [
        ["and4", [["a", "a"], ["b", "b"], ["out", "out"]]]
      ]
    });

    var a = graph.findBy({ name: "a" });
    var b = graph.findBy({ name: "b" });
    var out = graph.findBy({ name: "out" });

    expect(a.value.width).toEqual(4);
    expect(b.value.width).toEqual(4);
    expect(out.value.width).toEqual(4);
  });

  it("supports buses in the part assignments", function () {
    var graph = describedClass.parse("something", {
      inputs: [["a", 2]],
      outputs: ["out"],
      parts: [
        ["foo", [
          [["b", [0, 3]], ["a", [4, 5]]],
          [["bar", [0, 2]], "out"]
        ]
      ]]
    });

    var instance = graph.findBy({ name: "instance-0" });
    var a = graph.findBy({ name: "a" });

    var edges = instance.outEdges;

    expect(edges[1].value).toEqual({
      name: "b",
      thisStart: 4,
      thisEnd: 5,
      otherStart: 0,
      otherEnd: 3
    });

    expect(edges[2].value).toEqual({
      name: "bar",
      otherStart: 0,
      otherEnd: 2
    });

    expect(a.value.width).toEqual(2);
  });

  it("supports buses on intermediate pins", function () {
    var graph = describedClass.parse("something", {
      inputs: ["in"],
      outputs: ["out"],
      parts: [
        ["foo", [["bar", ["x", [1, 2]]]]]
      ]
    });

    var instance = graph.findBy({ name: "instance-0" });
    var edges = instance.outEdges;

    expect(edges[1].value).toEqual({
      name: "bar",
      thisStart: 1,
      thisEnd: 2
    });
  });

});
