"use strict";

var describedClass = require("../../lib/hdl/interface");
var Parser = require("../../lib/hdl/parser");

describe("Interface", function () {
  it("returns the correct interface for a truth-table chip", function () {
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

    var chip = graph.findBy({ name: "nand" });
    var result = new describedClass(chip);

    expect(result.inputs).toEqual(["a", "b"]);
    expect(result.outputs).toEqual(["out"]);
    expect(result.intermediates).toEqual([]);
  });

  it("returns the correct interface for a chip of parts", function () {
    var graph = Parser.parse("and", " \n\
      inputs a, b                     \n\
      outputs out                     \n\
                                      \n\
      nand(a=a, b=b, out=x)           \n\
      not(in=x, out=out)              \n\
    ");

    var chip = graph.findBy({ name: "and" });
    var result = new describedClass(chip);

    expect(result.inputs).toEqual(["a", "b"]);
    expect(result.outputs).toEqual(["out"]);
    expect(result.intermediates).toEqual(["x"]);
  });
});
