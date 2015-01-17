"use strict";

var Parser = require("../../../lib/hdl/parser");

describe("inputs", function () {
  var subject = new Parser({
    allowedStartRules: ["inputs"]
  });

  it("accepts valid", function () {
    expect(subject.parse("inputs a")).toEqual(["a"]);
    expect(subject.parse("inputs a, b")).toEqual(["a", "b"]);
    expect(subject.parse("inputs  in")).toEqual(["in"]);
  });

  it("rejects invalid", function () {
    expect(function () { subject.parse("inputs"); }).toThrow();
    expect(function () { subject.parse("INPUTS a"); }).toThrow();
    expect(function () { subject.parse("inputsa"); }).toThrow();
  });
});
