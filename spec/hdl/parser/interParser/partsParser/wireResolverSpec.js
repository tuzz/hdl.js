"use strict";

var parser = "../../../../../lib/hdl/parser";
var describedClass = require(parser + "/interParser/partsParser/wireResolver");

describe("WireResolver", function () {
  it("resolves strings correctly", function () {
    expect(describedClass.resolve(["foo", "bar"])).toEqual({ name: "foo" });
  });

  it("resolves arrays correctly", function () {
    expect(describedClass.resolve(
      [["foo", [1, 2]], ["bar", [3, 4]]]
    )).toEqual({
      name: "foo",
      thisStart: 3,
      thisEnd: 4,
      otherStart: 1,
      otherEnd: 2
    });

    expect(describedClass.resolve(
      ["foo", ["bar", [3, 4]]]
    )).toEqual({
      name: "foo",
      thisStart: 3,
      thisEnd: 4
    });

    expect(describedClass.resolve(
      [["foo", [1, 2]], "bar"]
    )).toEqual({
      name: "foo",
      otherStart: 1,
      otherEnd: 2
    });
  });
});
