"use strict";

var describedClass = require("../../lib/hdl/evaluator");
var Parser = require("../../lib/hdl/parser");
var Environment = require("../../lib/hdl/environment");

describe("Evaluator", function () {
  describe("evaluating expressions on 'nand'", function () {
    var nand = Parser.parse("nand", " \n\
      inputs a, b                     \n\
      outputs out                     \n\
                                      \n\
      | a | b | out |                 \n\
      | 0 | 0 |  1  |                 \n\
      | 0 | 1 |  1  |                 \n\
      | 1 | 0 |  1  |                 \n\
      | 1 | 1 |  0  |                 \n\
    ");
    var chip = nand.findBy({ name: "nand" });

    var a = { name: "a", type: "assignment" };
    var b = { name: "b", type: "assignment" };
    var out = { name: "out", type: "assignment" };

    var assignments = [
      { left: "a", right: a },
      { left: "b", right: b },
      { left: "out", right: out }
    ];

    beforeEach(function () {
      a.value = "inital value";
      b.value = "inital value";
      out.value = "inital value";
    });

    it("evaluates a = false, b = false correctly", function () {
      a.value = false;
      b.value = false;

      describedClass.evaluate(chip, assignments);
      expect(out.value).toEqual(true);
    });

    it("evaluates a = false, b = true correctly", function () {
      a.value = false;
      b.value = true;

      describedClass.evaluate(chip, assignments);
      expect(out.value).toEqual(true);
    });

    it("evaluates a = true, b = false correctly", function () {
      a.value = true;
      b.value = false;

      describedClass.evaluate(chip, assignments);
      expect(out.value).toEqual(true);
    });

    it("evaluates a = true, b = true correctly", function () {
      a.value = true;
      b.value = true;

      describedClass.evaluate(chip, assignments);
      expect(out.value).toEqual(false);
    });
  });

  describe("evaluating expressions on 'and'", function () {
    var nand = Parser.parse("nand", " \n\
      inputs a, b                     \n\
      outputs out                     \n\
                                      \n\
      | a | b | out |                 \n\
      | 0 | 0 |  1  |                 \n\
      | 0 | 1 |  1  |                 \n\
      | 1 | 0 |  1  |                 \n\
      | 1 | 1 |  0  |                 \n\
    ");

    var not = Parser.parse("not", " \n\
      inputs in                     \n\
      outputs out                   \n\
                                    \n\
      nand(a=in, b=in, out=out)     \n\
    ");

    var and = Parser.parse("and", " \n\
      inputs a, b                   \n\
      outputs out                   \n\
                                    \n\
      nand(a=a, b=b, out=x)         \n\
      not(in=x, out=out)            \n\
    ");

    var environment = new Environment();
    environment.addChip("nand", nand);
    environment.addChip("not", not);
    environment.addChip("and", and);

    var chip = environment.graph.findBy({ name: "and" });

    var a = { name: "a", type: "assignment" };
    var b = { name: "b", type: "assignment" };
    var out = { name: "out", type: "assignment" };

    var assignments = [
      { left: "a", right: a },
      { left: "b", right: b },
      { left: "out", right: out }
    ];

    beforeEach(function () {
      a.value = "inital value";
      b.value = "inital value";
      out.value = "inital value";
    });

    it("evaluates a = false, b = false correctly", function () {
      a.value = false;
      b.value = false;

      describedClass.evaluate(chip, assignments);
      expect(out.value).toEqual(false);
    });

    it("evaluates a = false, b = true correctly", function () {
      a.value = false;
      b.value = true;

      describedClass.evaluate(chip, assignments);
      expect(out.value).toEqual(false);
    });

    it("evaluates a = true, b = false correctly", function () {
      a.value = true;
      b.value = false;

      describedClass.evaluate(chip, assignments);
      expect(out.value).toEqual(false);
    });

    it("evaluates a = true, b = true correctly", function () {
      a.value = true;
      b.value = true;

      describedClass.evaluate(chip, assignments);
      expect(out.value).toEqual(true);
    });
  });
});
