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

  describe("#findBy", function () {
    it("finds a node by a subset of its valueobject's properties", function () {
      var graph = new Graph();
      var node = new Graph.Node({ foo: "foo", bar: 123 });
      graph.addNode(node);

      expect(graph.findBy({ foo: "foo" })).toEqual(node);
      expect(graph.findBy({ bar: 123 })).toEqual(node);
      expect(graph.findBy({ foo: "foo", bar: 123 })).toEqual(node);
      expect(graph.findBy({})).toEqual(node);

      expect(graph.findBy({ foo: "missing" })).toBeUndefined();
      expect(graph.findBy({ missing: "foo" })).toBeUndefined();
      expect(graph.findBy({ bar: 999 })).toBeUndefined();
      expect(graph.findBy({ foo: "foo", bar: 999 })).toBeUndefined();
      expect(graph.findBy({ foo: "foo", bar: 123, a: "b" })).toBeUndefined();
    });
  });

  describe("#where", function () {
    it("finds all node by a subset of their properties", function () {
      var graph = new Graph();

      var foo = new Graph.Node({ foo: "foo", bar: 123 });
      var bar = new Graph.Node({ foo: "bar", bar: 123 });

      graph.addNode(foo);
      graph.addNode(bar);

      expect(graph.where({ foo: "foo" })).toEqual([foo]);
      expect(graph.where({ foo: "bar" })).toEqual([bar]);
      expect(graph.where({ bar: 123 })).toEqual([foo, bar]);
      expect(graph.where({ foo: "foo", bar: 123 })).toEqual([foo]);
      expect(graph.where({})).toEqual([foo, bar]);

      expect(graph.where({ foo: "missing" })).toEqual([]);
      expect(graph.where({ missing: "foo" })).toEqual([]);
      expect(graph.where({ bar: 999 })).toEqual([]);
    });
  });

  describe("#removeNode", function () {
    it("removes the node from the graph", function () {
      var graph = new Graph();
      var node = new Graph.Node(1);

      graph.addNode(node);
      graph.removeNode(node);

      expect(graph.nodes.length).toEqual(0);
    });

    it("throws an error if the node is connected", function () {
      var graph = new Graph();

      var a = new Graph.Node(1);
      var b = new Graph.Node(2);
      var c = new Graph.Node(3);

      var ab = new Graph.Edge(a, b);
      var bc = new Graph.Edge(b, c);

      graph.addNode(a);
      graph.addNode(b);
      graph.addNode(c);

      graph.addEdge(ab);
      graph.addEdge(bc);

      expect(function () {
        graph.removeNode(b);
      }).toThrow(new Error("Unable to remove node because it is connected"));

      graph.removeEdge(bc);

      expect(function () {
        graph.removeNode(b);
      }).toThrow(new Error("Unable to remove node because it is connected"));

      graph.removeEdge(ab);
      graph.removeNode(b);

      expect(graph.nodes.length).toEqual(2);
      expect(graph.edges.length).toEqual(0);
    });
  });

  describe("#removeEdge", function () {
    it("removes the edge from the graph", function () {
      var graph = new Graph();

      var a = new Graph.Node(1);
      var b = new Graph.Node(1);
      var edge = new Graph.Edge(a, b);

      graph.addNode(a);
      graph.addNode(b);
      graph.addEdge(edge);

      graph.removeEdge(edge);
      expect(graph.edges.length).toEqual(0);
    });

    it("removes the edge from the in/out edges of dest/source", function () {
      var graph = new Graph();

      var a = new Graph.Node(1);
      var b = new Graph.Node(2);
      var c = new Graph.Node(3);

      var ab = new Graph.Edge(a, b);
      var ac = new Graph.Edge(a, c);
      var bc = new Graph.Edge(b, c);

      graph.addNode(a);
      graph.addNode(b);
      graph.addNode(c);

      graph.addEdge(ab);
      graph.addEdge(ac);
      graph.addEdge(bc);

      expect(graph.nodes.length).toEqual(3);
      expect(graph.edges.length).toEqual(3);

      graph.removeEdge(ab);
      expect(a.outEdges.length).toEqual(1);
      expect(b.inEdges.length).toEqual(0);

      graph.removeEdge(ac);
      expect(a.outEdges.length).toEqual(0);
      expect(c.inEdges.length).toEqual(1);

      expect(graph.nodes.length).toEqual(3);
      expect(graph.edges.length).toEqual(1);
    });
  });

  describe("idempotence", function () {
    it("is idempotent for #addNode", function () {
      var graph = new Graph();
      var node = new Graph.Node(1);

      graph.addNode(node);
      expect(graph.nodes.length).toEqual(1);

      graph.addNode(node);
      expect(graph.nodes.length).toEqual(1);
    });

    it("is idempotent for #removeNode", function () {
      var graph = new Graph();
      var node = new Graph.Node(1);
      graph.addNode(node);

      graph.removeNode(node);
      expect(graph.nodes.length).toEqual(0);

      graph.removeNode(node);
      expect(graph.nodes.length).toEqual(0);
    });

    it("is idempotent for #addEdge", function () {
      var graph = new Graph();
      var a = new Graph.Node(1);
      var b = new Graph.Node(1);
      var ab = new Graph.Edge(a, b);
      graph.addNode(a);
      graph.addNode(b);

      graph.addEdge(ab);
      expect(graph.edges.length).toEqual(1);
      expect(a.outEdges.length).toEqual(1);
      expect(b.inEdges.length).toEqual(1);

      graph.addEdge(ab);
      expect(graph.edges.length).toEqual(1);
      expect(a.outEdges.length).toEqual(1);
      expect(b.inEdges.length).toEqual(1);
    });

    it("is idempotent for #removeEdge", function () {
      var graph = new Graph();
      var a = new Graph.Node(1);
      var b = new Graph.Node(1);
      var ab = new Graph.Edge(a, b);
      graph.addNode(a);
      graph.addNode(b);
      graph.addEdge(ab);

      graph.removeEdge(ab);
      expect(graph.edges.length).toEqual(0);
      expect(a.outEdges.length).toEqual(0);
      expect(b.inEdges.length).toEqual(0);

      graph.removeEdge(ab);
      expect(graph.edges.length).toEqual(0);
      expect(a.outEdges.length).toEqual(0);
      expect(b.inEdges.length).toEqual(0);
    });
  });

  describe("#clone", function () {
    it("clones itself and all of its nodes and edges", function () {
      var graph = new Graph();

      var a = new Graph.Node({ name: "a" });
      var b = new Graph.Node({ name: "b" });
      var c = new Graph.Node({ name: "c" });

      var ab = new Graph.Edge(a, b);
      var ac = new Graph.Edge(a, c);

      graph.addNode(a);
      graph.addNode(b);
      graph.addNode(c);

      graph.addEdge(ab);
      graph.addEdge(ac);

      var clone = graph.clone();

      var _a = clone.findBy({ name: "a" });
      var _b = clone.findBy({ name: "b" });
      var _ab = _b.inEdges[0];

      clone.removeEdge(_ab);
      clone.removeNode(_b);

      expect(graph.nodes.length).toEqual(3);
      expect(graph.edges.length).toEqual(2);

      expect(clone.nodes.length).toEqual(2);
      expect(clone.edges.length).toEqual(1);

      expect(a.outEdges.length).toEqual(2);
      expect(_a.outEdges.length).toEqual(1);
    });
  });
});
