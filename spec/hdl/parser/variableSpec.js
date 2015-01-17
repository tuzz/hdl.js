"use strict";

var Parser = require("../../../lib/hdl/parser");

describe("variable", function () {
  var subject = new Parser({
    allowedStartRules: ["variable"]
  });

  it("accepts valid", function () {
    expect(subject.parse("a")).toEqual("a");
    expect(subject.parse("abc")).toEqual("abc");
    expect(subject.parse("a0")).toEqual("a0");
    expect(subject.parse("a00")).toEqual("a00");
    expect(subject.parse("a03")).toEqual("a03");
    expect(subject.parse("a_03")).toEqual("a_03");
  });

  it("rejects invalid", function () {
    expect(function () { subject.parse("0"); }).toThrow();
    expect(function () { subject.parse("0a"); }).toThrow();
    expect(function () { subject.parse("_"); }).toThrow();
    expect(function () { subject.parse("_a"); }).toThrow();
    expect(function () { subject.parse("A"); }).toThrow();
    expect(function () { subject.parse("!"); }).toThrow();
  });
});
