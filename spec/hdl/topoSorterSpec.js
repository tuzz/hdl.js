"use strict";

var Parser = require("../../lib/hdl/parser");
var Environment = require("../../lib/hdl/environment");
var describedClass = require("../../lib/hdl/topoSorter");

describe("TopoSorter", function () {
  var environment, nand, and;

  beforeEach(function () {
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
      nand(a=x, b=x, out=out)         \n\
      nand(a=a, b=b, out=x)           \n\
    ");

    environment = new Environment();
  });

  it("sorts instances of chips that have concrete dependencies", function () {
    environment.addChip("nand", nand);
    environment.addChip("and", and);

    describedClass.sort("and", environment);

    var graph = environment.graph;
    and = graph.findBy({ name: "and" });
    expect(and.outEdges.length).toEqual(2);

    var instance = and.outEdges[0].destination;
    expect(instance.value.name).toEqual("instance-1");

    instance = and.outEdges[1].destination;
    expect(instance.value.name).toEqual("instance-0");
  });

  it("does not sort instances of chips with abstract dependencies", function (){
    environment.addChip("and", and);

    describedClass.sort("and", environment);

    var graph = environment.graph;
    and = graph.findBy({ name: "and" });
    expect(and.outEdges.length).toEqual(2);

    var instance = and.outEdges[0].destination;
    expect(instance.value.name).toEqual("instance-0");

    instance = and.outEdges[1].destination;
    expect(instance.value.name).toEqual("instance-1");
  });

  it("recursively sorts chips that reference this one", function () {
    environment.addChip("nand", nand);
    environment.addChip("and", and);

    describedClass.sort("nand", environment);

    var graph = environment.graph;
    and = graph.findBy({ name: "and" });
    expect(and.outEdges.length).toEqual(2);

    var instance = and.outEdges[0].destination;
    expect(instance.value.name).toEqual("instance-1");

    instance = and.outEdges[1].destination;
    expect(instance.value.name).toEqual("instance-0");
  });
});
