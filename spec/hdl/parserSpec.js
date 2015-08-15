"use strict";

var describedClass = require("../../lib/hdl/parser");

describe("Parser", function () {
  it("parses chips containing parts", function () {
    var graph = describedClass.parse("and", "   \n\
      inputs a, b                               \n\
      outputs out                               \n\
                                                \n\
      nand(a=a, b=b, out=x)                     \n\
      nand(a=x, b=1, out=out)                   \n\
    ");

    var and = graph.findBy({ name: "and" });
    var nand = graph.findBy({ name: "nand" });
    var bool = graph.findBy({ name: "boolean" });
    var instanceB = graph.findBy({ name: "instance-b" });
    var instance0 = graph.findBy({ name: "instance-0" });
    var instance1 = graph.findBy({ name: "instance-1" });
    var a = graph.findBy({ name: "a" });
    var b = graph.findBy({ name: "b" });
    var x = graph.findBy({ name: "x" });
    var tru = graph.findBy({ name: "true" });
    var out = graph.findBy({ name: "out" });

    var edges = and.outEdges;
    expect(edges.length).toEqual(3);
    expect(edges[0].destination).toEqual(instanceB);
    expect(edges[1].destination).toEqual(instance0);
    expect(edges[2].destination).toEqual(instance1);
    expect(edges[0].value).toBeUndefined();
    expect(edges[1].value).toBeUndefined();
    expect(edges[2].value).toBeUndefined();

    edges = instanceB.outEdges;
    expect(edges.length).toEqual(2);
    expect(edges[0].destination).toEqual(bool);
    expect(edges[1].destination).toEqual(tru);
    expect(edges[0].value).toBeUndefined();
    expect(edges[1].value).toEqual({ name: "true" });

    // nand(a=a, b=b, out=x)
    edges = instance0.outEdges;
    expect(edges.length).toEqual(4);
    expect(edges[0].destination).toEqual(nand);
    expect(edges[1].destination).toEqual(a);
    expect(edges[2].destination).toEqual(b);
    expect(edges[3].destination).toEqual(x);
    expect(edges[0].value).toBeUndefined();
    expect(edges[1].value).toEqual({ name: "a" });
    expect(edges[2].value).toEqual({ name: "b" });
    expect(edges[3].value).toEqual({ name: "out" });

    // nand(a=x, b=1, out=out)
    edges = instance1.outEdges;
    expect(edges.length).toEqual(4);
    expect(edges[0].destination).toEqual(nand);
    expect(edges[1].destination).toEqual(x);
    expect(edges[2].destination).toEqual(tru);
    expect(edges[3].destination).toEqual(out);
    expect(edges[0].value).toBeUndefined();
    expect(edges[1].value).toEqual({ name: "a" });
    expect(edges[2].value).toEqual({ name: "b" });
    expect(edges[3].value).toEqual({ name: "out" });

    // check that everything is accounted for
    expect(graph.nodes.length).toEqual(11);
    expect(graph.edges.length).toEqual(13);
  });

  it("parses chips containing truth tables", function () {
    var graph = describedClass.parse("nand", " \n\
      inputs a, b                              \n\
      outputs out                              \n\
                                               \n\
      | a | b | out |                          \n\
      | 0 | 0 |  1  |                          \n\
      | 0 | 1 |  1  |                          \n\
      | 1 | 0 |  1  |                          \n\
      | 1 | 1 |  0  |                          \n\
    ");

    var nand = graph.findBy({ name: "nand" });
    var lookup = graph.findBy({ name: "lookup" });
    var instance0 = graph.findBy({ name: "instance-0" });
    var instance1 = graph.findBy({ name: "instance-1" });
    var instance2 = graph.findBy({ name: "instance-2" });
    var instance3 = graph.findBy({ name: "instance-3" });
    var a = graph.findBy({ name: "a" });
    var b = graph.findBy({ name: "b" });
    var out = graph.findBy({ name: "out" });

    expect(nand.value.type).toEqual("chip");
    expect(lookup.value.type).toEqual("chip");
    expect(instance0.value.type).toEqual("instance");
    expect(instance1.value.type).toEqual("instance");
    expect(instance2.value.type).toEqual("instance");
    expect(instance3.value.type).toEqual("instance");
    expect(a.value.type).toEqual("input");
    expect(b.value.type).toEqual("input");
    expect(out.value.type).toEqual("output");

    var edges = nand.outEdges;
    expect(edges.length).toEqual(4);
    expect(edges[0].destination).toEqual(instance0);
    expect(edges[1].destination).toEqual(instance1);
    expect(edges[2].destination).toEqual(instance2);
    expect(edges[3].destination).toEqual(instance3);
    expect(edges[0].value).toBeUndefined();
    expect(edges[1].value).toBeUndefined();
    expect(edges[2].value).toBeUndefined();
    expect(edges[3].value).toBeUndefined();

    edges = instance0.outEdges;
    expect(edges.length).toEqual(4);
    expect(edges[0].destination).toEqual(lookup);
    expect(edges[1].destination).toEqual(a);
    expect(edges[2].destination).toEqual(b);
    expect(edges[3].destination).toEqual(out);
    expect(edges[0].value).toBeUndefined();
    expect(edges[1].value.name).toEqual("false");
    expect(edges[2].value.name).toEqual("false");
    expect(edges[3].value.name).toEqual("true");

    edges = instance1.outEdges;
    expect(edges.length).toEqual(4);
    expect(edges[0].destination).toEqual(lookup);
    expect(edges[1].destination).toEqual(a);
    expect(edges[2].destination).toEqual(b);
    expect(edges[3].destination).toEqual(out);
    expect(edges[0].value).toBeUndefined();
    expect(edges[1].value.name).toEqual("false");
    expect(edges[2].value.name).toEqual("true");
    expect(edges[3].value.name).toEqual("true");

    edges = instance2.outEdges;
    expect(edges.length).toEqual(4);
    expect(edges[0].destination).toEqual(lookup);
    expect(edges[1].destination).toEqual(a);
    expect(edges[2].destination).toEqual(b);
    expect(edges[3].destination).toEqual(out);
    expect(edges[0].value).toBeUndefined();
    expect(edges[1].value.name).toEqual("true");
    expect(edges[2].value.name).toEqual("false");
    expect(edges[3].value.name).toEqual("true");

    edges = instance3.outEdges;
    expect(edges.length).toEqual(4);
    expect(edges[0].destination).toEqual(lookup);
    expect(edges[1].destination).toEqual(a);
    expect(edges[2].destination).toEqual(b);
    expect(edges[3].destination).toEqual(out);
    expect(edges[0].value).toBeUndefined();
    expect(edges[1].value.name).toEqual("true");
    expect(edges[2].value.name).toEqual("true");
    expect(edges[3].value.name).toEqual("false");

    // check that everything is accounted for
    expect(graph.nodes.length).toEqual(9);
    expect(graph.edges.length).toEqual(20);
  });
});
