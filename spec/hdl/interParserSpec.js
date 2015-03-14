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

    it("builds the correct graph", function () {
      var instance0 = graph.findBy({ name: "instance-0" });
      var instance1 = graph.findBy({ name: "instance-1" });
      var instance2 = graph.findBy({ name: "instance-2" });
      var instance3 = graph.findBy({ name: "instance-3" });
      var a         = graph.findBy({ name: "a" });
      var b         = graph.findBy({ name: "b" });
      var out       = graph.findBy({ name: "out" });
      var lookup    = graph.findBy({ name: "lookup" });

      expect(instance0.value.type).toEqual("instance");
      expect(instance1.value.type).toEqual("instance");
      expect(instance2.value.type).toEqual("instance");
      expect(instance3.value.type).toEqual("instance");
      expect(a.value.type).toEqual("input");
      expect(b.value.type).toEqual("input");
      expect(out.value.type).toEqual("output");
      expect(lookup.value.type).toEqual("chip");

      var edges = instance0.outEdges;

      expect(edges[0].destination).toEqual(lookup);
      expect(edges[1].destination).toEqual(a);
      expect(edges[2].destination).toEqual(b);
      expect(edges[3].destination).toEqual(out);

      expect(edges[0].value).toBeUndefined();
      expect(edges[1].value).toEqual(false);
      expect(edges[2].value).toEqual(false);
      expect(edges[3].value).toEqual(true);

      edges = instance1.outEdges;

      expect(edges[0].destination).toEqual(lookup);
      expect(edges[1].destination).toEqual(a);
      expect(edges[2].destination).toEqual(b);
      expect(edges[3].destination).toEqual(out);

      expect(edges[0].value).toBeUndefined();
      expect(edges[1].value).toEqual(false);
      expect(edges[2].value).toEqual(true);
      expect(edges[3].value).toEqual(true);

      edges = instance2.outEdges;

      expect(edges[0].destination).toEqual(lookup);
      expect(edges[1].destination).toEqual(a);
      expect(edges[2].destination).toEqual(b);
      expect(edges[3].destination).toEqual(out);

      expect(edges[0].value).toBeUndefined();
      expect(edges[1].value).toEqual(true);
      expect(edges[2].value).toEqual(false);
      expect(edges[3].value).toEqual(true);

      edges = instance3.outEdges;

      expect(edges[0].destination).toEqual(lookup);
      expect(edges[1].destination).toEqual(a);
      expect(edges[2].destination).toEqual(b);
      expect(edges[3].destination).toEqual(out);

      expect(edges[0].value).toBeUndefined();
      expect(edges[1].value).toEqual(true);
      expect(edges[2].value).toEqual(true);
      expect(edges[3].value).toEqual(false);

      expect(graph.nodes.length).toEqual(8);
      expect(graph.edges.length).toEqual(16);
    });
  });
});
