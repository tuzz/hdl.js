"use strict";

var describedClass = require("../../lib/hdl/interParser");

describe("InterParser", function () {
  describe("parsing an intermediate derived from a truth table", function () {
    var graph = describedClass.parse({
      inputs: ["a", "b"],
      outputs: ["out"],
      table: [
        [["a", false], ["b", false], ["out", true]],
        [["a", false], ["b", true],  ["out", true]],
        [["a", true],  ["b", false], ["out", true]],
        [["a", true],  ["b", true],  ["out", false]]
      ]
    });

    it("has the correct number of nodes and edges", function () {
      expect(graph.nodes.length).toEqual(8);
      expect(graph.edges.length).toEqual(16);
    });
  });
});
