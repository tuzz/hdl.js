"use strict";

var Parser = require("../../../lib/hdl/parser");

describe("buses", function () {
  var subject = new Parser();

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

  it("supports boolean buses", function () {
    var result = subject.parse(" \
      inputs in[3]               \
      outputs out[4]             \
                                 \
      foo(in=0, out=01TF)        \
    ");

    expect(result).toEqual({
      inputs: [["in", 3]],
      outputs: [["out", 4]],
      parts: [
        ["foo", [
          ["in", false],
          ["out", [false, true, true, false]]
        ]]
      ]
    });
  });
});
