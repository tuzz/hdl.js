"use strict";

var InputParser = require("../../../../lib/hdl/parser/inputParser");

describe("part", function () {
  var subject = new InputParser({
    allowedStartRules: ["part"]
  });

  it("accepts valid", function () {
    expect(subject.parse("not(in=a,out=out)")).toEqual([
      "not", [["in", "a"], ["out", "out"]]
    ]);

    expect(subject.parse("nand(a=a, b=b, out=x)")).toEqual([
      "nand", [["a", "a"], ["b", "b"], ["out", "x"]]
    ]);

    expect(subject.parse("abc0_(  in0=1, in1 = F, out_=a_ )")).toEqual([
      "abc0_", [["in0", true], ["in1", false], ["out_", "a_"]]
    ]);
  });

  it("rejects invalid", function () {
    expect(function () { subject.parse("not()"); }).toThrow();
    expect(function () { subject.parse("nand((a=a)"); }).toThrow();
    expect(function () { subject.parse("(a=a)"); }).toThrow();
    expect(function () { subject.parse("not(0=in)"); }).toThrow();
    expect(function () { subject.parse("and(a=_, b=1)"); }).toThrow();
  });
});
