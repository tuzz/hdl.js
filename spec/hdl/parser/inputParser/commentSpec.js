"use strict";

var InputParser = require("../../../../lib/hdl/parser/inputParser");

describe("comment", function () {
  var subject = new InputParser({
    allowedStartRules: ["comment"]
  });

  it("accepts valid", function () {
    expect(subject.parse("#Hello\n")).toEqual("");
    expect(subject.parse("# Hello\n")).toEqual("");
    expect(subject.parse("# Hello, world! #\n")).toEqual("");
    expect(subject.parse("### Hello # world!")).toEqual("");
  });

  it("rejects invalid", function () {
    expect(function () { subject.parse("Hello\n abc"); }).toThrow();
    expect(function () { subject.parse("# Hello\n abc\n"); }).toThrow();
  });
});
