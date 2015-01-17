"use strict";

var Parser = require("../../../lib/hdl/parser");

describe("assignments", function () {
  var subject = new Parser({
    allowedStartRules: ["assignments"]
  });

  it("accepts valid", function () {
    expect(subject.parse("a=a")).toEqual([["a", "a"]]);
    expect(subject.parse("a=a,b=b")).toEqual([["a", "a"], ["b", "b"]]);
    expect(subject.parse("a = a , b = b")).toEqual([["a", "a"], ["b", "b"]]);

    expect(subject.parse("a=a,b=b,c=1")).toEqual([
      ["a", "a"], ["b", "b"], ["c", true]
    ]);

    expect(subject.parse("a=x,b=y,abc0=F")).toEqual([
      ["a", "x"], ["b", "y"], ["abc0", false]
    ]);
  });

  it("rejects invalid", function () {
    expect(function () { subject.parse("a=a,"); }).toThrow();
    expect(function () { subject.parse(",a=a"); }).toThrow();
    expect(function () { subject.parse("a=a,b"); }).toThrow();
    expect(function () { subject.parse("a=a,a,b"); }).toThrow();
    expect(function () { subject.parse("a=00"); }).toThrow();
  });
});
