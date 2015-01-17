"use strict";

var Parser = require("../../../lib/hdl/parser");

describe("header", function () {
  var subject = new Parser({
    allowedStartRules: ["header"]
  });

  it("accepts valid", function () {
    expect(subject.parse("| a |")).toEqual(["a"]);
    expect(subject.parse("|in|out|")).toEqual(["in", "out"]);
    expect(subject.parse("| a |b| out |")).toEqual(["a", "b", "out"]);
  });

  it("rejects invalid", function () {
    expect(function () { subject.parse("a"); }).toThrow();
    expect(function () { subject.parse("|a"); }).toThrow();
    expect(function () { subject.parse("a|"); }).toThrow();
    expect(function () { subject.parse("||a|"); }).toThrow();
    expect(function () { subject.parse("|a b|"); }).toThrow();
    expect(function () { subject.parse("|a|0|"); }).toThrow();
  });
});
