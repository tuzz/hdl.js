"use strict";

var subgraphConnector = "../../../../lib/hdl/environment/subgraphConnector";
var describedClass = require(subgraphConnector + "/edgeRedirector");
var Graph = require("../../../../lib/hdl/graph");

describe("EdgeRedirector", function () {
  it("redirects inbound edges from one node to another", function () {
    var graph = new Graph();

    var instance = new Graph.Node(1);
    var from = new Graph.Node(2);
    var to = new Graph.Node(3);

    var edge = new Graph.Edge(instance, from, "value");

    graph.addNode(instance);
    graph.addNode(from);
    graph.addNode(to);

    graph.addEdge(edge);

    expect(from.inEdges.length).toEqual(1);
    expect(to.inEdges.length).toEqual(0);

    describedClass.redirect(graph, from, to);

    expect(from.inEdges.length).toEqual(0);
    expect(to.inEdges.length).toEqual(1);
    expect(to.inEdges[0].value).toEqual("value");
  });
});
