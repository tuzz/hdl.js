"use strict";

var Parser = require("../../../lib/hdl/parser");

describe("whitespace", function () {
  var subject = new Parser({
    allowedStartRules: ["whitespace"]
  });

  it("gathers whitespace to help with readability", function () {
    expect(subject.parse(" ")).toEqual(" ");
    expect(subject.parse("   ")).toEqual(" ");
    expect(subject.parse(" \t  ")).toEqual(" ");
    expect(subject.parse(" \t \n ")).toEqual(" ");
  });
});
