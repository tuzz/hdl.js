"use strict";

var InputParser = require("../../../../lib/hdl/parser/inputParser");

describe("outputs", function () {
  var subject = new InputParser({
    allowedStartRules: ["pins"]
  });

  it("accepts valid", function () {
    expect(subject.parse("inputs in \n outputs out")).toEqual({
      inputs: ["in"], outputs: ["out"]
    });

    expect(subject.parse("inputs a, b\noutputs out")).toEqual({
      inputs: ["a", "b"], outputs: ["out"]
    });

    expect(subject.parse("inputs  a, b[1] ,c\noutputs out_1_2_3")).toEqual({
      inputs: ["a", ["b", 1], "c"], outputs: ["out_1_2_3"]
    });
  });

  it("rejects invalid", function () {
    expect(function () { subject.parse("inputs a"); }).toThrow();
    expect(function () { subject.parse("outputs a"); }).toThrow();
    expect(function () { subject.parse("outputs a \n inputs b"); }).toThrow();
    expect(function () { subject.parse("inputs, a \n outputs b"); }).toThrow();
  });
});
