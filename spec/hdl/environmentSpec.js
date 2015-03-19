"use strict";

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
      nand(a=a, b=b, out=x)           \n\
      not(in=x, out=out)              \n\
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

    return;
    it("updates instances to point to the concrete chip", function () {
      subject.addChip("not", not);
      subject.addChip("nand", nand);

      var graph = subject.graph;
      var instance = graph.findBy({ name: "instance-0" });

      nand = instance.outEdges[0].destination;
      expect(nand.outEdges.length).toEqual(4);

      expect(graph.nodes.length).toEqual(13);
      expect(graph.edges.length).toEqual(25);
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

    return
    it("updates instances to point to a reference to the chip", function () {
      subject.addChip("nand", nand);
      subject.removeChip("nand", nand);

      var graph = subject.graph;
      var instance = graph.findBy({ name: "instance-0" });

      nand = instance.outEdges[0].destination;
      expect(nand.value.name).toEqual("nand");
      expect(nand.outEdges.length).toEqual(0);

      expect(graph.nodes.length).toEqual(5);
      expect(graph.edges.length).toEqual(5);
    });

    it("does not remove chips that are depended on by others", function () {
      subject.addChip("and", and);
      subject.addChip("nand", nand);

      var graph = subject.graph;
      var instance0 = graph.findBy({ name: "instance-0" });
      var instance1 = graph.findBy({ name: "instance-1" });

      nand = instance0.outEdges[0].destination;
      not = instance0.outEdges[0].destination;

      expect(nand.value.name).toEqual("nand");
      expect(not.value.name).toEqual("not");
      expect(nand.outEdges.length).toEqual(4);
      expect(not.outEdges.length).toEqual(0);

      expect(graph.nodes.length).toEqual(17);
      expect(graph.edges.length).toEqual(29);
    });
  });
});
