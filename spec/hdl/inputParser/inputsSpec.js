"use strict";

var InputParser = require("../../../lib/hdl/inputParser");

describe("inputs", function () {
  var subject = new InputParser({
    allowedStartRules: ["inputs"]
  });

  it("accepts valid", function () {
    expect(subject.parse("inputs a")).toEqual(["a"]);
    expect(subject.parse("inputs a, b")).toEqual(["a", "b"]);
    expect(subject.parse("inputs  in")).toEqual(["in"]);
    expect(subject.parse("inputs a[1]")).toEqual([["a", 1]]);
  });

  it("rejects invalid", function () {
    expect(function () { subject.parse("inputs"); }).toThrow();
    expect(function () { subject.parse("INPUTS a"); }).toThrow();
    expect(function () { subject.parse("inputsa"); }).toThrow();
  });
});
