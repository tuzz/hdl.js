"use strict";

var InputParser = require("../../../lib/hdl/inputParser");

describe("bus_single", function () {
  var subject = new InputParser({
    allowedStartRules: ["bus_single"]
  });

  it("accepts valid", function () {
    expect(subject.parse("[0]")).toEqual(0);
    expect(subject.parse("[1]")).toEqual(1);
    expect(subject.parse("[12]")).toEqual(12);
    expect(subject.parse("[ 12 ]")).toEqual(12);
  });

  it("rejects invalid", function () {
    expect(function () { subject.parse("[0..1]"); }).toThrow();
    expect(function () { subject.parse("[0,0]"); }).toThrow();
    expect(function () { subject.parse("[1 2]"); }).toThrow();
    expect(function () { subject.parse("[a]"); }).toThrow();
  });
});
