"use strict";

var InputParser = require("../../../../lib/hdl/parser/inputParser");

describe("parts", function () {
  var subject = new InputParser({
    allowedStartRules: ["parts"]
  });

  it("accepts valid", function () {
    expect(subject.parse("x(a=b,c=d)")).toEqual({
      parts: [
        ["x", [["a", "b"], ["c", "d"]]]
      ]
    });

    expect(subject.parse("x(a=b,c=d) \n\n y(a=b,c=d)")).toEqual({
      parts: [
        ["x", [["a", "b"], ["c", "d"]]],
        ["y", [["a", "b"], ["c", "d"]]]
      ]
    });
  });

  it("rejects invalid", function () {
    expect(function () { subject.parse("x(a=a), y(b=b)"); }).toThrow();
    expect(function () { subject.parse("x(a=a) foo"); }).toThrow();
    expect(function () { subject.parse("x(a=a)()"); }).toThrow();
  });
});
