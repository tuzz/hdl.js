"use strict";

var InputParser = require("../../../lib/hdl/inputParser");

describe("right_assignment", function () {
  var subject = new InputParser({
    allowedStartRules: ["right_assignment"]
  });

  it("accepts valid", function () {
    expect(subject.parse("a")).toEqual("a");
    expect(subject.parse("a[1]")).toEqual(["a", [1, 1]]);
    expect(subject.parse("a[1..2]")).toEqual(["a", [1, 2]]);
    expect(subject.parse("0")).toEqual(false);
    expect(subject.parse("T")).toEqual(true);
    expect(subject.parse("01")).toEqual([false, true]);
    expect(subject.parse("T10F")).toEqual([true, true, false, false]);
  });

  it("rejects invalid", function () {
    expect(function () { subject.parse("A"); }).toThrow();
    expect(function () { subject.parse("a[1 1]"); }).toThrow();
    expect(function () { subject.parse("012"); }).toThrow();
    expect(function () { subject.parse("0 0"); }).toThrow();
    expect(function () { subject.parse("TFA"); }).toThrow();
  });
});

