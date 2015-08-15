"use strict";

var describedClass = require("../../lib/hdl/evaluator");
var Parser = require("../../lib/hdl/parser");

describe("Evaluator", function () {
  describe("lookup chip", function () {
    var lookup = { value: { name: "lookup", type: "chip" } };
    var truthy = { name: "truthy", type: "assignment", value: true };
    var falsey = { name: "falsey", type: "assignment", value: false };

    var out = { name: "out", type: "assignment" };
    var x = { name: "x", type: "assignment" };
    var y = { name: "y", type: "assignment" };

    beforeEach(function () {
      out.value = "initial value";
      x.value = "initial value";
      y.value = "initial value";
    });

    it("assigns 'true' when true = true", function () {
      var assignments = [
        { left: true, right: truthy },
        { left: true, right: out }
      ];
      describedClass.evaluate(lookup, assignments);
      expect(out.value).toEqual(true);
    });

    it("assigns 'false' when true = true", function () {
      var assignments = [
        { left: true, right: truthy },
        { left: false, right: out }
      ];
      describedClass.evaluate(lookup, assignments);
      expect(out.value).toEqual(false);
    });

    it("does not assign when true = false", function () {
      var assignments = [
        { left: true, right: falsey },
        { left: true, right: out }
      ];
      describedClass.evaluate(lookup, assignments);
      expect(out.value).toEqual("initial value");
    });

    it("does not assign when false = true", function () {
      var assignments = [
        { left: false, right: truthy },
        { left: false, right: out }
      ];
      describedClass.evaluate(lookup, assignments);
      expect(out.value).toEqual("initial value");
    });

    it("assigns 'true' and 'false' when true = true", function () {
      var assignments = [
        { left: true, right: truthy },
        { left: true, right: x },
        { left: false, right: y }
      ];
      describedClass.evaluate(lookup, assignments);
      expect(x.value).toEqual(true);
      expect(y.value).toEqual(false);
    });

    it("does not assign when when true = true and true = false", function () {
      var assignments = [
        { left: true, right: truthy },
        { left: true, right: falsey },
        { left: false, right: x },
        { left: true, right: y }
      ];
      describedClass.evaluate(lookup, assignments);
      expect(x.value).toEqual("initial value");
      expect(y.value).toEqual("initial value");
    });
  });

  describe("concrete chips", function () {
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
});
