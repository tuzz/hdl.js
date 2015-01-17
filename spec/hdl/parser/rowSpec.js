"use strict";

var Parser = require("../../../lib/hdl/parser");

describe("row", function () {
  var subject = new Parser({
    allowedStartRules: ["row"]
  });

  it("accepts valid", function () {
    expect(subject.parse("| 0 |")).toEqual([false]);
    expect(subject.parse("| 1 |")).toEqual([true]);
    expect(subject.parse("| F |")).toEqual([false]);
    expect(subject.parse("| T |")).toEqual([true]);
    expect(subject.parse("| 0 | 1 |")).toEqual([false, true]);
    expect(subject.parse("| T | F |")).toEqual([true, false]);
    expect(subject.parse("| 1 | 1 | T |")).toEqual([true, true, true]);
  });

  it("rejects invalid", function () {
    expect(function () { subject.parse("0"); }).toThrow();
    expect(function () { subject.parse("T"); }).toThrow();
    expect(function () { subject.parse("|T"); }).toThrow();
    expect(function () { subject.parse("|T||"); }).toThrow();
    expect(function () { subject.parse("|T, F|"); }).toThrow();
    expect(function () { subject.parse("|01|"); }).toThrow();
  });
});
