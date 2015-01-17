"use strict";

var Parser = require("../../../lib/hdl/parser");

describe("interface_variable", function () {
  var subject = new Parser({
    allowedStartRules: ["interface_variable"]
  });

  it("accepts valid", function () {
    expect(subject.parse("a[4]")).toEqual(["a", 4]);
    expect(subject.parse("a[12]")).toEqual(["a", 12]);
    expect(subject.parse("a[ 12 ]")).toEqual(["a", 12]);
    expect(subject.parse("in0_[0]")).toEqual(["in0_", 0]);
    expect(subject.parse("a")).toEqual("a");
  });

  it("rejects invalid", function () {
    expect(function () { subject.parse("a[]"); }).toThrow();
    expect(function () { subject.parse("a[1..2]"); }).toThrow();
    expect(function () { subject.parse("A[1]"); }).toThrow();
    expect(function () { subject.parse("a [1]"); }).toThrow();
  });
});

