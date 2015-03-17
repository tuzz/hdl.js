"use strict";

var InputParser = require("../../../../lib/hdl/parser/inputParser");

describe("buses", function () {
  var subject = new InputParser();

  it("supports buses as part of the interface", function () {
    var result = subject.parse("    \
      inputs a[4], b[4]             \
      outputs out[4]                \
                                    \
      and4(a=a, b=b, out=out)       \
    ");

    expect(result).toEqual({
      inputs: [["a", 4], ["b", 4]],
      outputs: [["out", 4]],
      parts: [
        ["and4", [["a", "a"], ["b", "b"], ["out", "out"]]]
      ]
    });
  });

  it("supports buses in the part assignments", function () {
    var result = subject.parse("               \
      inputs in[8]                             \
      outputs out                              \
                                               \
      and4(a=in[0..3], b=in[4..7], out=x)      \
      mux(a=in[0], b=in[7], sel=x[0], out=out) \
    ");

    expect(result).toEqual({
      inputs: [["in", 8]],
      outputs: ["out"],
      parts: [
        ["and4", [
          ["a", ["in", [0, 3]]],
          ["b", ["in", [4, 7]]],
          ["out", "x"]
        ]],
        ["mux", [
          ["a",   ["in", [0, 0]]],
          ["b",   ["in", [7, 7]]],
          ["sel", ["x",  [0, 0]]],
          ["out", "out"]
        ]]
      ]
    });
  });
});
