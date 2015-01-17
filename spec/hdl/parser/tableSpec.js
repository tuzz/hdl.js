"use strict";

var Parser = require("../../../lib/hdl/parser");

describe("row", function () {
  var subject = new Parser({
    allowedStartRules: ["table"]
  });

  it("accepts valid", function () {
    expect(subject.parse("| a | out | \n | 0 | 1 | \n | 1 | 0 |")).toEqual({
      table: [
        [["a", false], ["out", true]], [["a", true], ["out", false]]
      ]
    });

    expect(subject.parse("| a | b | out | \n | F | F | T |")).toEqual({
      table: [
        [["a", false], ["b", false], ["out", true]]
      ]
    });

    expect(subject.parse("| a | b | abc1__ |     |0|1| F | |1|1|1|")).toEqual({
      table: [
        [["a", false], ["b", true], ["abc1__", false]],
        [["a", true], ["b", true], ["abc1__", true]]
      ]
    });
  });

  it("rejects invalid", function () {
    expect(function () { subject.parse("|in|out|"); }).toThrow();
    expect(function () { subject.parse("|0|1|"); }).toThrow();
    expect(function () { subject.parse("|in|out|0|1|"); }).toThrow();
    expect(function () { subject.parse("|0|1| \n |a|b|"); }).toThrow();
    expect(function () { subject.parse("| a |  | \n | 0 | 1 |"); }).toThrow();
  });
});
