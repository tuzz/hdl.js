"use strict";

var Parser = require("../../../lib/hdl/parser");
var Environment = require("../../../lib/hdl/environment");

describe("TseitinTransformer", function () {
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

  it("calculates a CNF for chips with concrete dependencies", function () {
    environment.addChip("nand", nand);
    environment.addChip("and", and);

    var graph = environment.graph;
    and = graph.findBy({ name: "and" });
    expect(and.value.cnfExpression).toBeDefined();
  });

  it("doesn't calculate a CNF for chips with abstract dependencies",function (){
    environment.addChip("and", and);

    var graph = environment.graph;
    and = graph.findBy({ name: "and" });
    expect(and.value.cnfExpression).toBeUndefined();
  });

  it("recursively calculates CNFs for chips that reference this", function () {
    environment.addChip("and", and);
    environment.addChip("nand", nand);

    var graph = environment.graph;
    and = graph.findBy({ name: "and" });
    expect(and.value.cnfExpression).toBeDefined();
  });

  it("calculates CNFs for chips that use booleans", function () {
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
    expect(foo.value.cnfExpression).toBeDefined();
  });
});
