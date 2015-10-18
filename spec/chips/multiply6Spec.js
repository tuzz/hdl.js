"use strict";

var describedChip = "multiply_6";
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
      a5: _, a4: _, a3: _, a2: _, a1: _, a0: _, // 0
      b5: _, b4: _, b3: _, b2: _, b1: _, b0: _  // 0
    });
    expect(result).toEqual({
      // 0
      o11: _, o10: _, o9: _, o8: _, o7: _, o6: _,
      o5:  _, o4:  _, o3: _, o2: _, o1: _, o0: _,
    });

    result = HDL.evaluate(describedChip, {
      a5: _, a4: _, a3: T, a2: _, a1: T, a0: _, // 10
      b5: _, b4: _, b3: _, b2: T, b1: _, b0: T  // 5
    });
    expect(result).toEqual({
      // 50
      o11: _, o10: _, o9: _, o8: _, o7: _, o6: _,
      o5:  T, o4:  T, o3: _, o2: _, o1: T, o0: _,
    });

    result = HDL.evaluate(describedChip, {
      a5: _, a4: _, a3: T, a2: T, a1: _, a0: T, // 13
      b5: _, b4: _, b3: _, b2: T, b1: T, b0: T  // 7
    });
    expect(result).toEqual({
      // 91
      o11: _, o10: _, o9: _, o8: _, o7: _, o6: T,
      o5:  _, o4:  T, o3: T, o2: _, o1: T, o0: T,
    });

    result = HDL.evaluate(describedChip, {
      a5: T, a4: T, a3: T, a2: T, a1: T, a0: T, // 63
      b5: T, b4: T, b3: T, b2: T, b1: T, b0: T  // 63
    });
    expect(result).toEqual({
      // 3969
      o11: T, o10: T, o9: T, o8: T, o7: T, o6: _,
      o5:  _, o4:  _, o3: _, o2: _, o1: _, o0: T,
    });

    result = HDL.evaluate(describedChip, {
      a5: T, a4: _, a3: T, a2: T, a1: T, a0: T, // 47
      b5: _, b4: T, b3: T, b2: T, b1: _, b0: _  // 28
    });
    expect(result).toEqual({
      // 1316
      o11: _, o10: T, o9: _, o8: T, o7: _, o6: _,
      o5:  T, o4:  _, o3: _, o2: T, o1: _, o0: _,
    });
  });
});
