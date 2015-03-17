"use strict";

var InputParser = require("../../../../lib/hdl/parser/inputParser");

describe("bus_range", function () {
  var subject = new InputParser({
    allowedStartRules: ["bus_range"]
  });

  it("accepts valid", function () {
    expect(subject.parse("[0..0]")).toEqual([0, 0]);
    expect(subject.parse("[0..1]")).toEqual([0, 1]);
    expect(subject.parse("[12..13]")).toEqual([12, 13]);
    expect(subject.parse("[ 12..13 ]")).toEqual([12, 13]);
  });

  it("rejects invalid", function () {
    expect(function () { subject.parse("[0]"); }).toThrow();
    expect(function () { subject.parse("[0,1]"); }).toThrow();
    expect(function () { subject.parse("[1 .. 2]"); }).toThrow();
    expect(function () { subject.parse("[-1..1]"); }).toThrow();
    expect(function () { subject.parse("[1.2]"); }).toThrow();
  });
});
