"use strict";

var Graph = require("../../lib/hdl/graph");

describe("graph", function () {
  it("supports arbitrary digraphs of nodes and edges", function () {
    var graph = new Graph();

    var n1 = new Graph.Node(1);
    var n2 = new Graph.Node(2);

    var e1 = new Graph.Edge(n1, n2, 111);
    var e2 = new Graph.Edge(n1, n2, 222);
    var e3 = new Graph.Edge(n2, n1, 333);

    graph.addNode(n1);
    graph.addNode(n2);

    graph.addEdge(e1);
    graph.addEdge(e2);
    graph.addEdge(e3);

    expect(graph.nodes).toEqual([n1, n2]);
    n1 = graph.nodes[0];
    n2 = graph.nodes[1];

    expect(n1.value).toEqual(1);
    expect(n1.outEdges).toEqual([e1, e2]);
    expect(n1.inEdges).toEqual([e3]);

    expect(n2.value).toEqual(2);
    expect(n2.outEdges).toEqual([e3]);
    expect(n2.inEdges).toEqual([e1, e2]);

    e1 = graph.edges[0];
    e2 = graph.edges[1];
    e3 = graph.edges[2];

    expect(e1.value).toEqual(111);
    expect(e1.source).toEqual(n1);
    expect(e1.destination).toEqual(n2);

    expect(e2.value).toEqual(222);
    expect(e2.source).toEqual(n1);
    expect(e2.destination).toEqual(n2);

    expect(e3.value).toEqual(333);
    expect(e3.source).toEqual(n2);
    expect(e3.destination).toEqual(n1);
  });
});
