"use strict";

var Parser = require("../../../lib/hdl/parser");

describe("part_variable", function () {
  var subject = new Parser({
    allowedStartRules: ["part_variable"]
  });

  it("accepts valid", function () {
    expect(subject.parse("a[4]")).toEqual(["a", [4, 4]]);
    expect(subject.parse("a[12]")).toEqual(["a", [12, 12]]);
    expect(subject.parse("a[ 12 ]")).toEqual(["a", [12, 12]]);
    expect(subject.parse("in0_[0]")).toEqual(["in0_", [0, 0]]);
    expect(subject.parse("a")).toEqual("a");
    expect(subject.parse("a[1..1]")).toEqual(["a", [1, 1]]);
    expect(subject.parse("a[1..2]")).toEqual(["a", [1, 2]]);
    expect(subject.parse("a[1..20]")).toEqual(["a", [1, 20]]);
    expect(subject.parse("a[ 1..20 ]")).toEqual(["a", [1, 20]]);
  });

  it("rejects invalid", function () {
    expect(function () { subject.parse("a[]"); }).toThrow();
    expect(function () { subject.parse("A[1]"); }).toThrow();
    expect(function () { subject.parse("a [1]"); }).toThrow();
    expect(function () { subject.parse("a[1.2]"); }).toThrow();
  });
});


