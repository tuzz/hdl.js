/*jshint -W024 */

"use strict";

var HDL = require("../lib/hdl");

describe("HDL", function () {
  beforeEach(function () {
    HDL.reset();
  });

  it("lets you define chips and check their interfaces", function () {
    HDL.define("not", "          \n\
      inputs in                  \n\
      outputs out                \n\
                                 \n\
      nand(a=in, b=in, out=out)  \n\
    ");

    HDL.define("nand", "         \n\
      inputs a, b                \n\
      outputs out                \n\
                                 \n\
      | a | b | out |            \n\
      | 0 | 0 |  1  |            \n\
      | 0 | 1 |  1  |            \n\
      | 1 | 0 |  1  |            \n\
      | 1 | 1 |  0  |            \n\
    ");

    HDL.define("and", "          \n\
      inputs a, b                \n\
      outputs out                \n\
                                 \n\
      not(in=x, out=out)         \n\
      nand(a=a, b=b, out=x)      \n\
    ");

    var result = HDL.interface("not");
    expect(result.inputs).toEqual(["in"]);
    expect(result.outputs).toEqual(["out"]);
    expect(result.intermediates).toEqual([]);

    result = HDL.interface("nand");
    expect(result.inputs).toEqual(["a", "b"]);
    expect(result.outputs).toEqual(["out"]);
    expect(result.intermediates).toEqual([]);

    result = HDL.interface("and");
    expect(result.inputs).toEqual(["a", "b"]);
    expect(result.outputs).toEqual(["out"]);
    expect(result.intermediates).toEqual(["x"]);
  });
});
