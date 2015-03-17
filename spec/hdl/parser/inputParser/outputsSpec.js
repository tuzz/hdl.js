"use strict";

var InputParser = require("../../../../lib/hdl/parser/inputParser");

describe("outputs", function () {
  var subject = new InputParser({
    allowedStartRules: ["outputs"]
  });

  it("accepts valid", function () {
    expect(subject.parse("outputs a")).toEqual(["a"]);
    expect(subject.parse("outputs a, b")).toEqual(["a", "b"]);
    expect(subject.parse("outputs  in")).toEqual(["in"]);
    expect(subject.parse("outputs a[1]")).toEqual([["a", 1]]);
  });

  it("rejects invalid", function () {
    expect(function () { subject.parse("outputs"); }).toThrow();
    expect(function () { subject.parse("OUTPUTS a"); }).toThrow();
    expect(function () { subject.parse("outputsa"); }).toThrow();
  });
});
