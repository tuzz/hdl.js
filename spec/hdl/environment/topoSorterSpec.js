"use strict";

var Parser = require("../../../lib/hdl/parser");
var Environment = require("../../../lib/hdl/environment");

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

    var graph = environment.graph;
    and = graph.findBy({ name: "and" });
    expect(and.outEdges.length).toEqual(2);

    var instance = and.outEdges[0].destination;
    expect(instance.value.name).toEqual("instance-1");
    expect(instance.inEdges[0]).toEqual(and.outEdges[0]);

    instance = and.outEdges[1].destination;
    expect(instance.value.name).toEqual("instance-0");
    expect(instance.inEdges[0]).toEqual(and.outEdges[1]);
  });

  it("does not sort instances of chips with abstract dependencies", function (){
    environment.addChip("and", and);

    var graph = environment.graph;
    and = graph.findBy({ name: "and" });
    expect(and.outEdges.length).toEqual(2);

    var instance = and.outEdges[0].destination;
    expect(instance.value.name).toEqual("instance-0");

    instance = and.outEdges[1].destination;
    expect(instance.value.name).toEqual("instance-1");
  });

  it("recursively sorts chips that reference this one", function () {
    environment.addChip("and", and);
    environment.addChip("nand", nand);

    var graph = environment.graph;
    and = graph.findBy({ name: "and" });
    expect(and.outEdges.length).toEqual(2);

    var instance = and.outEdges[0].destination;
    expect(instance.value.name).toEqual("instance-1");

    instance = and.outEdges[1].destination;
    expect(instance.value.name).toEqual("instance-0");
  });

  it("raises a helpful error if unable to sort", function () {
    var foo = Parser.parse("foo", "             \n\
      inputs a, b                               \n\
      outputs out                               \n\
                                                \n\
      nand(a=a, b=b, out=out)                   \n\
      nand(a[0]=x[1], b[0..1]=x[1..2], out=out) \n\
    ");

    environment.addChip("nand", nand);

    expect(function () {
      environment.addChip("foo", foo);
    }).toThrow();
  });

  it("sorts instances of chips that use booleans", function () {
    var foo = Parser.parse("foo", "   \n\
      inputs a, b                     \n\
      outputs out                     \n\
                                      \n\
      nand(a=1, b=y, out=x)           \n\
      nand(a=x, b=x, out=out)         \n\
      nand(a=a, b=b, out=y)           \n\
    ");

    environment.addChip("nand", nand);
    environment.addChip("foo", foo);

    var graph = environment.graph;
    foo = graph.findBy({ name: "foo" });
    expect(foo.outEdges.length).toEqual(4);

    var instance = foo.outEdges[0].destination;
    expect(instance.value.name).toEqual("instance-b");

    instance = foo.outEdges[1].destination;
    expect(instance.value.name).toEqual("instance-2");

    instance = foo.outEdges[2].destination;
    expect(instance.value.name).toEqual("instance-0");

    instance = foo.outEdges[3].destination;
    expect(instance.value.name).toEqual("instance-1");
  });

  it("works as expected for a complex example", function () {
    var add3 = Parser.parse("add_3", "              \n\
      inputs a0, a1, a2,                            \n\
             b0, b1, b2                             \n\
                                                    \n\
      outputs o0, o1, o2, carry                     \n\
                                                    \n\
      half_adder(a=a0, b=b0, sum=o0, carry=c0)      \n\
      adder(a=a1, b=b1, c=c0, sum=o1, carry=c1)     \n\
      adder(a=a2, b=b2, c=c1, sum=o2, carry=carry)  \n\
    ");

    var adder = Parser.parse("adder", "                   \n\
      inputs a, b, c                                      \n\
      outputs sum, carry                                  \n\
                                                          \n\
      half_adder(a=a, b=b, sum=sum_ab, carry=carry_ab)    \n\
      half_adder(a=sum_ab, b=c, sum=sum, carry=carry_abc) \n\
      xor(a=carry_ab, b=carry_abc, out=carry)             \n\
    ");

    var halfAdder = Parser.parse("half_adder", "  \n\
      inputs a, b                                 \n\
      outputs sum, carry                          \n\
                                                  \n\
      | a | b | sum | carry |                     \n\
      | 0 | 0 | 0   | 0     |                     \n\
      | 0 | 1 | 1   | 0     |                     \n\
      | 1 | 0 | 1   | 0     |                     \n\
      | 1 | 1 | 0   | 1     |                     \n\
    ");

    var xor = Parser.parse("xor", "  \n\
      inputs a, b                    \n\
      outputs out                    \n\
                                     \n\
      | a | b | out |                \n\
      | 0 | 0 | 0   |                \n\
      | 0 | 1 | 1   |                \n\
      | 1 | 0 | 1   |                \n\
      | 1 | 1 | 0   |                \n\
    ");

    expect(function () {
      environment.addChip("add_3", add3);
      environment.addChip("adder", adder);
      environment.addChip("half_adder", halfAdder);
      environment.addChip("xor", xor);
    }).not.toThrow();
  });
});
