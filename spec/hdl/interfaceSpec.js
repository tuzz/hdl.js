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

    expect(result.inputs).toEqual([
      { name: "a", width: 1 },
      { name: "b", width: 1 }
    ]);

    expect(result.outputs).toEqual([
      { name: "out", width: 1 }
    ]);

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

    expect(result.inputs).toEqual([
      { name: "a", width: 1 },
      { name: "b", width: 1 }
    ]);

    expect(result.outputs).toEqual([
      { name: "out", width: 1 }
    ]);

    expect(result.intermediates).toEqual([
      { name: "x" }
    ]);
  });

  it("returns the correct interface for chips with buses", function () {
    var graph = Parser.parse("foo", "       \n\
      inputs a[4], b[2]                     \n\
      outputs out[4]                        \n\
                                            \n\
      bar(x=a[0..1], y=a[2..3], out=out[0]) \n\
      baz(x=b, out=intermediate)            \n\
      qux(x=intermediate, out=out[1..2])    \n\
    ");

    var chip = graph.findBy({ name: "foo" });
    var result = new describedClass(chip);

    expect(result.inputs).toEqual([
      { name: "a", width: 4 },
      { name: "b", width: 2 }
    ]);

    expect(result.outputs).toEqual([
      { name: "out", width: 4 }
    ]);

    expect(result.intermediates).toEqual([
      { name: "intermediate" }
    ]);
  });
});
