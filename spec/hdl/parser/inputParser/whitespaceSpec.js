"use strict";

var InputParser = require("../../../../lib/hdl/parser/inputParser");

describe("whitespace", function () {
  var subject = new InputParser({
    allowedStartRules: ["whitespace"]
  });

  it("gathers whitespace to help with readability", function () {
    expect(subject.parse(" ")).toEqual(" ");
    expect(subject.parse("   ")).toEqual(" ");
    expect(subject.parse(" \t  ")).toEqual(" ");
    expect(subject.parse(" \t \n ")).toEqual(" ");
  });
});
