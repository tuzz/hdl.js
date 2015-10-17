"use strict";

var describedChip = "multiply_4";
var HDL = require("../../lib/hdl");
var fs = require("fs");

describe(describedChip, function () {
  var define = function (name) {
    var root = [__dirname, "..", ".."].join("/");
    var path = [root, "chips", name + ".hdl"].join("/");
    var hdl = fs.readFileSync(path).toString();

    HDL.define(name, hdl);
  };

  beforeEach(function () {
    HDL.reset();
    define(describedChip);
    define("half_adder");
    define("adder");
    define("and");
    define("xor");
  });

  it("behaves as expected", function () {
    var _ = false;
    var T = true;

    var result = HDL.evaluate(describedChip, {
      a3: _, a2: _, a1: _, a0: _, // 0
      b3: _, b2: _, b1: _, b0: _  // 0
    });
    expect(result).toEqual({
      o7: _, o6: _, o5: _, o4: _, o3: _, o2: _, o1: _, o0: _, // 0
    });

    result = HDL.evaluate(describedChip, {
      a3: T, a2: _, a1: T, a0: _, // 10
      b3: _, b2: T, b1: _, b0: T  // 5
    });
    expect(result).toEqual({
      o7: _, o6: _, o5: T, o4: T, o3: _, o2: _, o1: T, o0: _, // 50
    });

    result = HDL.evaluate(describedChip, {
      a3: T, a2: T, a1: _, a0: T, // 13
      b3: _, b2: T, b1: T, b0: T  // 7
    });
    expect(result).toEqual({
      o7: _, o6: T, o5: _, o4: T, o3: T, o2: _, o1: T, o0: T, // 91
    });
  });
});
