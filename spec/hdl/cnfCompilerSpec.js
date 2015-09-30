"use strict";

var describedClass = require("../../lib/hdl/cnfCompiler");
var Environment = require("../../lib/hdl/environment");
var Parser = require("../../lib/hdl/parser");

describe("CNFCompiler", function () {
  var nand, and, environment;

  beforeEach(function () {
    environment = new Environment();

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

    environment.addChip("nand", nand);
    environment.addChip("and", and);
  });

  it("compiles CNF expressions for truth table chips", function () {
    var expression = describedClass.compile("nand", environment);

    expect(expression.conjunctions.length).toEqual(4);
    var conjunctions = expression.conjunctions;

    expect(conjunctions[0].disjunctions.length).toEqual(3);
    var disjunctions = conjunctions[0].disjunctions;

    expect(disjunctions[0].value).toEqual("a");
    expect(disjunctions[0].isNegation).toEqual(false);
    expect(disjunctions[1].value).toEqual("b");
    expect(disjunctions[1].isNegation).toEqual(false);
    expect(disjunctions[2].value).toEqual("out");
    expect(disjunctions[2].isNegation).toEqual(false);

    expect(conjunctions[1].disjunctions.length).toEqual(3);
    disjunctions = conjunctions[1].disjunctions;

    expect(disjunctions[0].value).toEqual("a");
    expect(disjunctions[0].isNegation).toEqual(false);
    expect(disjunctions[1].value).toEqual("b");
    expect(disjunctions[1].isNegation).toEqual(true);
    expect(disjunctions[2].value).toEqual("out");
    expect(disjunctions[2].isNegation).toEqual(false);

    expect(conjunctions[2].disjunctions.length).toEqual(3);
    disjunctions = conjunctions[2].disjunctions;

    expect(disjunctions[0].value).toEqual("a");
    expect(disjunctions[0].isNegation).toEqual(true);
    expect(disjunctions[1].value).toEqual("b");
    expect(disjunctions[1].isNegation).toEqual(false);
    expect(disjunctions[2].value).toEqual("out");
    expect(disjunctions[2].isNegation).toEqual(false);

    expect(conjunctions[3].disjunctions.length).toEqual(3);
    disjunctions = conjunctions[3].disjunctions;

    expect(disjunctions[0].value).toEqual("a");
    expect(disjunctions[0].isNegation).toEqual(true);
    expect(disjunctions[1].value).toEqual("b");
    expect(disjunctions[1].isNegation).toEqual(true);
    expect(disjunctions[2].value).toEqual("out");
    expect(disjunctions[2].isNegation).toEqual(true);
  });

  it("compiles CNF expressions for chips", function () {
    var expression = describedClass.compile("and", environment);

    expect(expression.conjunctions.length).toEqual(8);
    var conjunctions = expression.conjunctions;

    expect(conjunctions[0].disjunctions.length).toEqual(3);
    var disjunctions = conjunctions[0].disjunctions;

    expect(disjunctions[0].value).toEqual("a");
    expect(disjunctions[0].isNegation).toEqual(false);
    expect(disjunctions[1].value).toEqual("b");
    expect(disjunctions[1].isNegation).toEqual(false);
    expect(disjunctions[2].value).toEqual("x");
    expect(disjunctions[2].isNegation).toEqual(false);

    expect(conjunctions[1].disjunctions.length).toEqual(3);
    disjunctions = conjunctions[1].disjunctions;

    expect(disjunctions[0].value).toEqual("a");
    expect(disjunctions[0].isNegation).toEqual(false);
    expect(disjunctions[1].value).toEqual("b");
    expect(disjunctions[1].isNegation).toEqual(true);
    expect(disjunctions[2].value).toEqual("x");
    expect(disjunctions[2].isNegation).toEqual(false);

    expect(conjunctions[2].disjunctions.length).toEqual(3);
    disjunctions = conjunctions[2].disjunctions;

    expect(disjunctions[0].value).toEqual("a");
    expect(disjunctions[0].isNegation).toEqual(true);
    expect(disjunctions[1].value).toEqual("b");
    expect(disjunctions[1].isNegation).toEqual(false);
    expect(disjunctions[2].value).toEqual("x");
    expect(disjunctions[2].isNegation).toEqual(false);

    expect(conjunctions[3].disjunctions.length).toEqual(3);
    disjunctions = conjunctions[3].disjunctions;

    expect(disjunctions[0].value).toEqual("a");
    expect(disjunctions[0].isNegation).toEqual(true);
    expect(disjunctions[1].value).toEqual("b");
    expect(disjunctions[1].isNegation).toEqual(true);
    expect(disjunctions[2].value).toEqual("x");
    expect(disjunctions[2].isNegation).toEqual(true);

    expect(conjunctions[4].disjunctions.length).toEqual(3);
    disjunctions = conjunctions[4].disjunctions;

    expect(disjunctions[0].value).toEqual("x");
    expect(disjunctions[0].isNegation).toEqual(false);
    expect(disjunctions[1].value).toEqual("x");
    expect(disjunctions[1].isNegation).toEqual(false);
    expect(disjunctions[2].value).toEqual("out");
    expect(disjunctions[2].isNegation).toEqual(false);

    expect(conjunctions[5].disjunctions.length).toEqual(3);
    disjunctions = conjunctions[5].disjunctions;

    expect(disjunctions[0].value).toEqual("x");
    expect(disjunctions[0].isNegation).toEqual(false);
    expect(disjunctions[1].value).toEqual("x");
    expect(disjunctions[1].isNegation).toEqual(true);
    expect(disjunctions[2].value).toEqual("out");
    expect(disjunctions[2].isNegation).toEqual(false);

    expect(conjunctions[6].disjunctions.length).toEqual(3);
    disjunctions = conjunctions[6].disjunctions;

    expect(disjunctions[0].value).toEqual("x");
    expect(disjunctions[0].isNegation).toEqual(true);
    expect(disjunctions[1].value).toEqual("x");
    expect(disjunctions[1].isNegation).toEqual(false);
    expect(disjunctions[2].value).toEqual("out");
    expect(disjunctions[2].isNegation).toEqual(false);

    expect(conjunctions[7].disjunctions.length).toEqual(3);
    disjunctions = conjunctions[7].disjunctions;

    expect(disjunctions[0].value).toEqual("x");
    expect(disjunctions[0].isNegation).toEqual(true);
    expect(disjunctions[1].value).toEqual("x");
    expect(disjunctions[1].isNegation).toEqual(true);
    expect(disjunctions[2].value).toEqual("out");
    expect(disjunctions[2].isNegation).toEqual(true);
  });
});

