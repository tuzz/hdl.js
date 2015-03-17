"use strict";

var InputParser = require("../../../../lib/hdl/parser/inputParser");

describe("assignment", function () {
  var subject = new InputParser({
    allowedStartRules: ["assignment"]
  });

  it("accepts valid", function () {
    expect(subject.parse("a=b")).toEqual(["a", "b"]);
    expect(subject.parse("asd=asd")).toEqual(["asd", "asd"]);
    expect(subject.parse("a = b")).toEqual(["a", "b"]);
    expect(subject.parse("a = a0_")).toEqual(["a", "a0_"]);
    expect(subject.parse("a=0")).toEqual(["a", false]);
    expect(subject.parse("a=T")).toEqual(["a", true]);
    expect(subject.parse("a=a[0]")).toEqual(["a", ["a", [0, 0]]]);
    expect(subject.parse("a=a[1..2]")).toEqual(["a", ["a", [1, 2]]]);
    expect(subject.parse("a[2]=a[1..2]")).toEqual(
      [["a", [2, 2]], ["a", [1, 2]]]
    );
  });

  it("rejects invalid", function () {
    expect(function () { subject.parse("a="); }).toThrow();
    expect(function () { subject.parse("=a"); }).toThrow();
    expect(function () { subject.parse("a==a"); }).toThrow();
    expect(function () { subject.parse("A=A"); }).toThrow();
    expect(function () { subject.parse("a=b=c"); }).toThrow();
    expect(function () { subject.parse("0=a"); }).toThrow();
    expect(function () { subject.parse("F=T"); }).toThrow();
  });
});
