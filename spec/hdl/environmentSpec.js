"use strict";

var _ = require("underscore");
var describedClass = require("../../lib/hdl/environment");
var Parser = require("../../lib/hdl/parser");

describe("Environment", function () {
  var subject, not, nand, and;

  beforeEach(function () {
    subject = new describedClass();

    not = Parser.parse("not", "       \n\
      inputs in                       \n\
      outputs out                     \n\
                                      \n\
      nand(a=in, b=in, out=out)       \n\
    ");

    nand = Parser.parse("nand", "     \n\
      inputs a, b                     \n\
      outputs out                     \n\
                                      \n\
      | a | b | out |                 \n\
      | 0 | 0 |  1  |                 \n\
      | 0 | 1 |  1  |                 \n\
      | 1 | 0 |  1  |                 \n\
      | 1 | 1 |  0  |                 \n\
    ");

    and = Parser.parse("and", "       \n\
      inputs a, b                     \n\
      outputs out                     \n\
                                      \n\
      not(in=x, out=out)              \n\
      nand(a=a, b=b, out=x)           \n\
    ");
  });

  describe("#addChip", function () {
    it("adds a chip to the environment", function () {
      subject.addChip("not", not);

      var graph = subject.graph;
      expect(graph.nodes.length).toEqual(5);
      expect(graph.edges.length).toEqual(5);
    });

    it("is idempotent", function () {
      subject.addChip("not", not);
      subject.addChip("not", not);
      subject.addChip("not", not);

      var graph = subject.graph;
      expect(graph.nodes.length).toEqual(5);
      expect(graph.edges.length).toEqual(5);
    });

    it("updates instances to point to the concrete chip", function () {
      subject.addChip("not", not);
      subject.addChip("nand", nand);
      subject.addChip("and", and);

      var graph = subject.graph;
      not = graph.findBy({ name: "not" });
      and = graph.findBy({ name: "and" });

      var instance = not.outEdges[0].destination;
      nand = instance.outEdges[3].destination;
      // edge redirector put the redirected edge at the end

      expect(nand.value.name).toEqual("nand");
      expect(nand.outEdges.length).toEqual(4);

      instance = and.outEdges[1].destination;
      // topo sorter put the instance in position 1
      not = instance.outEdges[2].destination;

      expect(not.value.name).toEqual("not");
      expect(not.outEdges.length).toEqual(1);

      instance = and.outEdges[0].destination;
      // topo sorter put the instance in position 0
      nand = instance.outEdges[3].destination;
      // edge redirector put the redirected edge at the end

      expect(nand.value.name).toEqual("nand");
      expect(nand.outEdges.length).toEqual(4);

      var nots = graph.where({ name: "not" });
      var nands = graph.where({ name: "nand" });
      var ands = graph.where({ name: "and" });

      expect(nots.length).toEqual(1);
      expect(nands.length).toEqual(1);
      expect(ands.length).toEqual(1);
    });
  });

  describe("#removeChip", function () {
    beforeEach(function () {
      subject.addChip("not", not);
    });

    it("removes a chip from the environment", function () {
      subject.removeChip("not");

      var graph = subject.graph;
      expect(graph.nodes.length).toEqual(0);
      expect(graph.edges.length).toEqual(0);
    });

    it("is idempotent", function () {
      subject.removeChip("not");
      subject.removeChip("not");
      subject.removeChip("not");

      var graph = subject.graph;
      expect(graph.nodes.length).toEqual(0);
      expect(graph.edges.length).toEqual(0);
    });

    it("updates instances to point to a reference to the chip", function () {
      subject.addChip("nand", nand);
      subject.addChip("and", and);

      subject.removeChip("nand");

      var graph = subject.graph;
      not = graph.findBy({ name: "not" });
      and = graph.findBy({ name: "and" });

      var instance = not.outEdges[0].destination;
      nand = instance.outEdges[3].destination;
      // edge redirector put the redirected edge at the end

      expect(nand.value.name).toEqual("nand");
      expect(nand.outEdges.length).toEqual(0);

      instance = and.outEdges[1].destination;
      // topo sorter put the instance in position 1
      not = instance.outEdges[2].destination;

      expect(not.value.name).toEqual("not");
      expect(not.outEdges.length).toEqual(1);

      instance = and.outEdges[0].destination;
      // topo sorter put the instance in position 0
      nand = instance.outEdges[3].destination;
      // edge redirector put the redirected edge at the end

      expect(nand.value.name).toEqual("nand");
      expect(nand.outEdges.length).toEqual(0);

      var nots = graph.where({ name: "not" });
      var nands = graph.where({ name: "nand" });
      var ands = graph.where({ name: "and" });

      expect(nots.length).toEqual(1);
      expect(nands.length).toEqual(1);
      expect(ands.length).toEqual(1);
    });

    it("does not remove chips that are depended on by others", function () {
      subject.addChip("nand", nand);
      subject.addChip("and", and);

      var graph = subject.graph;
      nand = graph.findBy({ name: "nand" });

      expect(nand.outEdges.length).toEqual(4);

      subject.removeChip("not");

      expect(nand.outEdges.length).toEqual(4);
    });
  });

  describe("integration test", function () {
    it("behaves as expected", function () {
      var graph = subject.graph;

      expect(graph.nodes.length).toEqual(0);
      expect(graph.edges.length).toEqual(0);

      subject.removeChip("and");
      subject.addChip("and", and);
      subject.removeChip("and");

      expect(graph.nodes.length).toEqual(0);
      expect(graph.edges.length).toEqual(0);

      subject.addChip("nand", nand);
      subject.addChip("and", and);
      subject.addChip("not", not);
      subject.addChip("not", not);
      subject.addChip("not", not);
      subject.removeChip("nand");
      subject.removeChip("and");
      subject.removeChip("and");
      subject.removeChip("and");
      subject.removeChip("not");

      expect(graph.nodes.length).toEqual(0);
      expect(graph.edges.length).toEqual(0);

      subject.addChip("nand", nand);

      expect(graph.nodes.length).toEqual(9);
      expect(graph.edges.length).toEqual(20);

      subject.addChip("not", not);

      expect(graph.nodes.length).toEqual(13);
      expect(graph.edges.length).toEqual(25);

      subject.addChip("and", and);

      expect(graph.nodes.length).toEqual(20);
      expect(graph.edges.length).toEqual(34);

      var nodeNames = _.map(graph.nodes, function (n) { return n.value.name; });
      expect(nodeNames).toEqual([
        "nand",
        "lookup",
        "a",
        "b",
        "out",
        "instance-0",
        "instance-1",
        "instance-2",
        "instance-3",
        "not",
        "in",
        "out",
        "instance-0",
        "and",
        "x",
        "out",
        "instance-0",
        "a",
        "b",
        "instance-1"
      ]);

      var xor = Parser.parse("xor", " \n\
        inputs a, b                   \n\
        outputs out                   \n\
                                      \n\
        | a | b | out |               \n\
        | 0 | 0 |  0  |               \n\
        | 0 | 1 |  1  |               \n\
        | 1 | 0 |  1  |               \n\
        | 1 | 1 |  0  |               \n\
      ");

      subject.addChip("xor", xor);

      var lookup = graph.findBy({ name: "lookup" });
      expect(lookup).toBeDefined();
      expect(lookup.inEdges.length).toEqual(8);

      subject.removeChip("nand");

      lookup = graph.findBy({ name: "lookup" });
      expect(lookup).toBeDefined();
      expect(lookup.inEdges.length).toEqual(4);

      subject.removeChip("xor");

      lookup = graph.findBy({ name: "lookup" });
      expect(lookup).toBeUndefined();

      expect(graph.nodes.length).toEqual(12);
      expect(graph.edges.length).toEqual(14);

      var alternativeAnd = Parser.parse("and", " \n\
        inputs a, b                              \n\
        outputs out                              \n\
                                                 \n\
        | a | b | out |                          \n\
        | 0 | 0 |  0  |                          \n\
        | 0 | 1 |  0  |                          \n\
        | 1 | 0 |  0  |                          \n\
        | 1 | 1 |  1  |                          \n\
      ");

      subject.addChip("and", alternativeAnd);

      var ands = graph.where({ name: "and" });
      expect(ands.length).toEqual(1);

      expect(graph.nodes.length).toEqual(14);
      expect(graph.edges.length).toEqual(25);
    });
  });
});
