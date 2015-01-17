"use strict";

var Parser = require("../../../lib/hdl/parser");

describe("variables", function () {
  var subject = new Parser({
    allowedStartRules: ["variables"]
  });

  it("accepts valid", function () {
    expect(subject.parse("a")).toEqual(["a"]);
    expect(subject.parse("a,b,c")).toEqual(["a", "b", "c"]);
    expect(subject.parse("a,b,cde")).toEqual(["a", "b", "cde"]);
    expect(subject.parse("a  ,b  ,cde")).toEqual(["a", "b", "cde"]);
  });

  it("rejects invalid", function () {
    expect(function () { subject.parse(",a"); }).toThrow();
    expect(function () { subject.parse("a,,b"); }).toThrow();
    expect(function () { subject.parse("a,b,"); }).toThrow();
    expect(function () { subject.parse("A,b"); }).toThrow();
    expect(function () { subject.parse(","); }).toThrow();
  });
});
