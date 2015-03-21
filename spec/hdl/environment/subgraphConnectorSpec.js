"use strict";

var describedClass = require("../../../lib/hdl/environment/subgraphConnector");
var Parser = require("../../../lib/hdl/parser");
var Graph = require("../../../lib/hdl/graph");

describe("SubgraphConnector", function () {
  var andGraph, nandGraph, notGraph;

  beforeEach(function () {
    andGraph = Parser.parse("and", "   \n\
      inputs a, b                      \n\
      outputs out                      \n\
                                       \n\
      nand(a=a, b=b, out=x)            \n\
      not(in=x, out=out)               \n\
    ");

    nandGraph = Parser.parse("nand", " \n\
      inputs a, b                      \n\
      outputs out                      \n\
                                       \n\
      | a | b | out |                  \n\
      | 0 | 0 |  1  |                  \n\
      | 0 | 1 |  1  |                  \n\
      | 1 | 0 |  1  |                  \n\
      | 1 | 1 |  0  |                  \n\
    ");

    notGraph = Parser.parse("not", "   \n\
      inputs in                        \n\
      outputs out                      \n\
                                       \n\
      nand(a=in, b=in, out=out)        \n\
    ");
  });

  it("connects 'references' to 'concretions' of chips", function () {
    var graph = new Graph();

    graph.nodes = graph.nodes.concat(andGraph.nodes);
    graph.nodes = graph.nodes.concat(nandGraph.nodes);
    graph.nodes = graph.nodes.concat(notGraph.nodes);

    var nands = graph.where({ name: "nand" });
    var nots = graph.where({ name: "not" });

    expect(nands.length).toEqual(3);
    expect(nots.length).toEqual(2);

    describedClass.connect(graph);

    nands = graph.where({ name: "nand" });
    nots = graph.where({ name: "not" });

    expect(nands.length).toEqual(1);
    expect(nots.length).toEqual(1);

    var nand = graph.findBy({ name: "nand" });
    expect(nand.inEdges.length).toEqual(2);
    expect(nand.outEdges.length).toEqual(4);

    var not = graph.findBy({ name: "not" });
    expect(not.inEdges.length).toEqual(1);
    expect(not.outEdges.length).toEqual(1);
  });

  it("connects 'references' when there is no 'concretion'", function () {
    var graph = new Graph();

    graph.nodes = graph.nodes.concat(andGraph.nodes);
    graph.nodes = graph.nodes.concat(notGraph.nodes);

    var nands = graph.where({ name: "nand" });
    expect(nands.length).toEqual(2);

    describedClass.connect(graph);

    nands = graph.where({ name: "nand" });
    expect(nands.length).toEqual(1);

    var nand = graph.findBy({ name: "nand" });
    expect(nand.inEdges.length).toEqual(2);
    expect(nand.outEdges.length).toEqual(0);
  });
});
