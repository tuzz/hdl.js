"use strict";

var InputParser = require("../../../../lib/hdl/parser/inputParser");

describe("bus_suffix", function () {
  var subject = new InputParser({
    allowedStartRules: ["bus_suffix"]
  });

  it("accepts valid", function () {
    expect(subject.parse("[0]")).toEqual([0, 0]);
    expect(subject.parse("[12]")).toEqual([12, 12]);
    expect(subject.parse("[1..2]")).toEqual([1, 2]);
    expect(subject.parse("[ 1..20 ]")).toEqual([1, 20]);
  });

  it("rejects invalid", function () {
    expect(function () { subject.parse("[]"); }).toThrow();
    expect(function () { subject.parse("[1 2]"); }).toThrow();
    expect(function () { subject.parse("[1..2..3]"); }).toThrow();
  });
});

