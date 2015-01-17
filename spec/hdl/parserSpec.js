"use strict";

var Parser = require("../../lib/hdl/parser");

describe("Parser", function () {
  var subject = new Parser();

  it("parses truth tables", function () {
    var result = subject.parse("    \n\
      # nand                        \n\
                                    \n\
      inputs a, b                   \n\
      outputs out                   \n\
                                    \n\
      | a | b | out |               \n\
      | 0 | 0 |  T  |               \n\
      | 0 | 1 |  T  |               \n\
      | 1 | 0 |  T  |               \n\
      | 1 | 1 |  F  |               \n\
    ");

    expect(result).toEqual({
      inputs: ["a", "b"],
      outputs: ["out"],
      table: [
        [["a", false], ["b", false], ["out", true]],
        [["a", false], ["b", true],  ["out", true]],
        [["a", true],  ["b", false], ["out", true]],
        [["a", true],  ["b", true],  ["out", false]]
      ]
    });
  });

  it("parses chips with parts", function () {
    var result = subject.parse("    \n\
      # and                         \n\
      inputs a, b                   \n\
      outputs out                   \n\
                                    \n\
      nand(a=a, b=b, out=x)         \n\
      nand(a=x, b=x, out=out)       \n\
    ");

    expect(result).toEqual({
      inputs: ["a", "b"],
      outputs: ["out"],
      parts: [
        ["nand", [["a", "a"], ["b", "b"], ["out", "x"]]],
        ["nand", [["a", "x"], ["b", "x"], ["out", "out"]]]
      ]
    });
  });
});
