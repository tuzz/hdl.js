/*jshint -W024 */

"use strict";

var HDL = require("../lib/hdl");
var fs = require("fs");

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

  it("lets you undefine chips", function () {
    HDL.define("not", "          \n\
      inputs in                  \n\
      outputs out                \n\
                                 \n\
      nand(a=in, b=in, out=out)  \n\
    ");

    HDL.undefine("not");

    expect(function () {
      HDL.interface("not");
    }).toThrow();
  });

  it("lets you reset the environment", function () {
    HDL.define("not", "          \n\
      inputs in                  \n\
      outputs out                \n\
                                 \n\
      nand(a=in, b=in, out=out)  \n\
    ");

    HDL.reset();

    expect(function () {
      HDL.interface("not");
    }).toThrow();
  });

  it("lets you evaluate expressions", function () {
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

    var result = HDL.evaluate("not", { in: true });
    expect(result).toEqual({ out: false });

    result = HDL.evaluate("not", { in: false });
    expect(result).toEqual({ out: true });

    result = HDL.evaluate("nand", { a: true, b: true });
    expect(result).toEqual({ out: false });

    result = HDL.evaluate("nand", { a: false, b: false });
    expect(result).toEqual({ out: true });
  });

  it("lets you output a dot graph", function () {
    HDL.define("nand", "              \n\
      inputs a, b                     \n\
      outputs out                     \n\
                                      \n\
      | a | b | out |                 \n\
      | 0 | 0 |  1  |                 \n\
      | 0 | 1 |  1  |                 \n\
      | 1 | 0 |  1  |                 \n\
      | 1 | 1 |  0  |                 \n\
    ");

    HDL.define("and", "               \n\
      inputs a, b                     \n\
      outputs out                     \n\
                                      \n\
      not(in=x, out=out)              \n\
      nand(a=a, b=b, out=x)           \n\
    ");

    var path = [__dirname, "fixtures", "expected.dot"].join("/");
    var dot = fs.readFileSync(path).toString();

    expect(HDL.toDot()).toEqual(dot);
  });
});
