"use strict";

var describedChip = "multiply_by_100";
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
    define("and")
    define("xor");
    define("half_adder");
    define("adder");
    define(describedChip);
  });

  it("behaves as expected", function () {
    var _ = false;
    var T = true;

    // 0
    var result = HDL.evaluate(describedChip, {
      i11: _, i10: _, i9: _, i8: _, i7: _, i6: _,
      i5:  _, i4:  _, i3: _, i2: _, i1: _, i0: _
    });
    // 0
    expect(result).toEqual({
      o19: _, o18: _, o17: _, o16: _,
      o15: _, o14: _, o13: _, o12: _, o11: _, o10: _, o9: _, o8: _,
      o7:  _, o6:  _, o5:  _, o4:  _, o3:  _, o2:  _, o1: _, o0: _,
    });

    // 1
    result = HDL.evaluate(describedChip, {
      i11: _, i10: _, i9: _, i8: _, i7: _, i6: _,
      i5:  _, i4:  _, i3: _, i2: _, i1: _, i0: T
    });
    // 100
    expect(result).toEqual({
      o19: _, o18: _, o17: _, o16: _,
      o15: _, o14: _, o13: _, o12: _, o11: _, o10: _, o9: _, o8: _,
      o7:  _, o6:  T, o5:  T, o4:  _, o3:  _, o2:  T, o1: _, o0: _,
    });

    // 1234
    result = HDL.evaluate(describedChip, {
      i11: _, i10: T, i9: _, i8: _, i7: T, i6: T,
      i5:  _, i4:  T, i3: _, i2: _, i1: T, i0: _
    });
    // 123400
    expect(result).toEqual({
      o19: _, o18: _, o17: _, o16: T,
      o15: T, o14: T, o13: T, o12: _, o11: _, o10: _, o9: T, o8: _,
      o7:  _, o6:  _, o5:  _, o4:  _, o3:  T, o2:  _, o1: _, o0: _,
    });

    // 4095
    result = HDL.evaluate(describedChip, {
      i11: T, i10: T, i9: T, i8: T, i7: T, i6: T,
      i5:  T, i4:  T, i3: T, i2: T, i1: T, i0: T
    });
    // 409500
    expect(result).toEqual({
      o19: _, o18: T, o17: T, o16: _,
      o15: _, o14: _, o13: T, o12: T, o11: T, o10: T, o9: T, o8: T,
      o7:  T, o6:  _, o5:  _, o4:  T, o3:  T, o2:  T, o1: _, o0: _,
    });
  });
});
