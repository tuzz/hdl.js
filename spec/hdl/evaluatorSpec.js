"use strict";

var describedClass = require("../../lib/hdl/evaluator");
var Parser = require("../../lib/hdl/parser");
var Environment = require("../../lib/hdl/environment");

describe("Evaluator", function () {
  describe("evaluating expressions on 'nand'", function () {
    var graph = Parser.parse("nand", " \n\
      inputs a, b                     \n\
      outputs out                     \n\
                                      \n\
      | a | b | out |                 \n\
      | 0 | 0 |  1  |                 \n\
      | 0 | 1 |  1  |                 \n\
      | 1 | 0 |  1  |                 \n\
      | 1 | 1 |  0  |                 \n\
    ");

    var nand = graph.findBy({ name: "nand" });

    it("evaluates a = false, b = false correctly", function () {
      var result = describedClass.evaluateExpression(nand, {
        a: false, b: false
      });

      expect(result).toEqual({ out: true });
    });

    it("evaluates a = false, b = true correctly", function () {
      var result = describedClass.evaluateExpression(nand, {
        a: false, b: true
      });

      expect(result).toEqual({ out: true });
    });

    it("evaluates a = true, b = false correctly", function () {
      var result = describedClass.evaluateExpression(nand, {
        a: true, b: false
      });

      expect(result).toEqual({ out: true });
    });

    it("evaluates a = true, b = true correctly", function () {
      var result = describedClass.evaluateExpression(nand, {
        a: true, b: true
      });

      expect(result).toEqual({ out: false });
    });
  });

  describe("evaluating expressions on 'and'", function () {
    var nandGraph = Parser.parse("nand", " \n\
      inputs a, b                          \n\
      outputs out                          \n\
                                           \n\
      | a | b | out |                      \n\
      | 0 | 0 |  1  |                      \n\
      | 0 | 1 |  1  |                      \n\
      | 1 | 0 |  1  |                      \n\
      | 1 | 1 |  0  |                      \n\
    ");

    var notGraph = Parser.parse("not", " \n\
      inputs in                          \n\
      outputs out                        \n\
                                         \n\
      nand(a=in, b=in, out=out)          \n\
    ");

    var andGraph = Parser.parse("and", " \n\
      inputs a, b                        \n\
      outputs out                        \n\
                                         \n\
      nand(a=a, b=b, out=x)              \n\
      not(in=x, out=out)                 \n\
    ");

    var environment = new Environment();
    environment.addChip("nand", nandGraph);
    environment.addChip("not", notGraph);
    environment.addChip("and", andGraph);

    var and = environment.graph.findBy({ name: "and" });

    it("evaluates a = false, b = false correctly", function () {
      var result = describedClass.evaluateExpression(and, {
        a: false, b: false
      });

      expect(result).toEqual({ out: false });
    });

    it("evaluates a = false, b = true correctly", function () {
      var result = describedClass.evaluateExpression(and, {
        a: false, b: true
      });

      expect(result).toEqual({ out: false });
    });

    it("evaluates a = true, b = false correctly", function () {
      var result = describedClass.evaluateExpression(and, {
        a: true, b: false
      });

      expect(result).toEqual({ out: false });
    });

    it("evaluates a = true, b = true correctly", function () {
      var result = describedClass.evaluateExpression(and, {
        a: true, b: true
      });

      expect(result).toEqual({ out: true });
    });
  });

  describe("evaluating expressions on chips using booleans", function () {
    var nandGraph = Parser.parse("nand", " \n\
      inputs a, b                          \n\
      outputs out                          \n\
                                           \n\
      | a | b | out |                      \n\
      | 0 | 0 |  1  |                      \n\
      | 0 | 1 |  1  |                      \n\
      | 1 | 0 |  1  |                      \n\
      | 1 | 1 |  0  |                      \n\
    ");

    var fooGraph = Parser.parse("foo", " \n\
      inputs in                          \n\
      outputs out                        \n\
                                         \n\
      nand(a=in, b=1, out=out)           \n\
    ");

    var environment = new Environment();
    environment.addChip("nand", nandGraph);
    environment.addChip("foo", fooGraph);

    var foo = environment.graph.findBy({ name: "foo" });

    it("evaluates in = false correctly", function () {
      var result = describedClass.evaluateExpression(foo, { "in": false });
      expect(result).toEqual({ out: true });
    });

    it("evaluates in = true correctly", function () {
      var result = describedClass.evaluateExpression(foo, { "in": true });
      expect(result).toEqual({ out: false });
    });
  });

  describe("evaluating expressions on an abstract chips", function () {
    var graph = Parser.parse("not", " \n\
      inputs in                     \n\
      outputs out                   \n\
                                    \n\
      nand(a=in, b=in, out=out)     \n\
    ");

    var environment = new Environment();
    environment.addChip("not", graph);

    var not = environment.graph.findBy({ name: "not" });

    it("does not set the output value", function () {
      var result = describedClass.evaluateExpression(not, {
        "in": true
      });

      expect(result).toEqual({});
    });
  });
});
