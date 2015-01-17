"use strict";

var Parser = require("../../../lib/hdl/parser");

describe("interface_variables", function () {
  var subject = new Parser({
    allowedStartRules: ["interface_variables"]
  });

  it("accepts valid", function () {
    expect(subject.parse("a")).toEqual(["a"]);
    expect(subject.parse("a,b,c")).toEqual(["a", "b", "c"]);
    expect(subject.parse("a,b,cde")).toEqual(["a", "b", "cde"]);
    expect(subject.parse("a  ,b  ,cde")).toEqual(["a", "b", "cde"]);
    expect(subject.parse("a[1]")).toEqual([["a", 1]]);
    expect(subject.parse("a[1],b")).toEqual([["a", 1], "b"]);
    expect(subject.parse("a[10], b[ 1 ]")).toEqual([["a", 10], ["b", 1]]);
  });

  it("rejects invalid", function () {
    expect(function () { subject.parse(",a"); }).toThrow();
    expect(function () { subject.parse("a,,b"); }).toThrow();
    expect(function () { subject.parse("a,b,"); }).toThrow();
    expect(function () { subject.parse("A,b"); }).toThrow();
    expect(function () { subject.parse(","); }).toThrow();
    expect(function () { subject.parse("a[1..2]"); }).toThrow();
    expect(function () { subject.parse("a[-1]"); }).toThrow();
  });
});
