"use strict";

var InputParser = require("../../../lib/hdl/inputParser");

describe("boolean_bus", function () {
  var subject = new InputParser({
    allowedStartRules: ["boolean_bus"]
  });

  it("accepts valid", function () {
    expect(subject.parse("00")).toEqual([false, false]);
    expect(subject.parse("10")).toEqual([true, false]);
    expect(subject.parse("TF1")).toEqual([true, false, true]);
    expect(subject.parse("TTTT")).toEqual([true, true, true, true]);
  });

  it("rejects invalid", function () {
    expect(function () { subject.parse("0"); }).toThrow();
    expect(function () { subject.parse("T"); }).toThrow();
    expect(function () { subject.parse("0 0"); }).toThrow();
    expect(function () { subject.parse("0,0"); }).toThrow();
  });
});
