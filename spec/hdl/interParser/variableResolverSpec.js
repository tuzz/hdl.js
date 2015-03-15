"use strict";

var describedClass = require("../../../lib/hdl/interParser/variableResolver");

describe("VariableResolver", function () {
  it("resolves strings correctly", function () {
    var result = describedClass.resolve("foo");
    var expectation = { name: "foo" };

    expect(result).toEqual(expectation);
  });

  it("resolves booleans correctly", function () {
    expect(describedClass.resolve(true)).toEqual({ name: "true" });
    expect(describedClass.resolve(false)).toEqual({ name: "false" });
  });

  it("resolves arrays correctly", function () {
    var result = describedClass.resolve(["foo", 5]);
    var expectation = { name: "foo", width: 5 };

    expect(result).toEqual(expectation);
  });

  it("resolves nested arrays correctly", function () {
    var result = describedClass.resolve(["foo", [2, 5]]);
    var expectation = { name: "foo", start: 2, end: 5 };

    expect(result).toEqual(expectation);
  });
});
