"use strict";

var describedChip = "subtract_24";
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
    define("or");
    define("half_subtractor");
    define("subtractor");
  });

  it("behaves as expected", function () {
    var _ = false;
    var T = true;

    var result = HDL.evaluate(describedChip, {
      // 11111111
      a23: T, a22: _, a21: T, a20: _, a19: T, a18: _, a17: _, a16: T,
      a15: T, a14: _, a13: _, a12: _, a11: T, a10: _, a9:  T, a8:  _,
      a7:  T, a6:  T, a5:  _, a4:  _, a3:  _, a2:  T, a1:  T, a0:  T,

      // 2222222
      b23: _, b22: _, b21: T, b20: _, b19: _, b18: _, b17: _, b16: T,
      b15: T, b14: T, b13: T, b12: _, b11: T, b10: _, b9:  _, b8:  _,
      b7:  T, b6:  _, b5:  _, b4:  _, b3:  T, b2:  T, b1:  T, b0:  _
    });

    expect(result).toEqual({
      // 8888889
      o23: T, o22: _, o21: _, o20: _, o19: _, o18: T, o17: T, o16: T,
      o15: T, o14: _, o13: T, o12: _, o11: _, o10: _, o9:  T, o8:  _,
      o7:  _, o6:  _, o5:  T, o4:  T, o3:  T, o2:  _, o1:  _, o0:  T,
      borrow: _
    });

    result = HDL.evaluate(describedChip, {
      // 12345678
      a23: T, a22: _, a21: T, a20: T, a19: T, a18: T, a17: _, a16: _,
      a15: _, a14: T, a13: T, a12: _, a11: _, a10: _, a9:  _, a8:  T,
      a7:  _, a6:  T, a5:  _, a4:  _, a3:  T, a2:  T, a1:  T, a0:  _,

      // 1234567
      b23: _, b22: _, b21: _, b20: T, b19: _, b18: _, b17: T, b16: _,
      b15: T, b14: T, b13: _, b12: T, b11: _, b10: T, b9:  T, b8:  _,
      b7:  T, b6:  _, b5:  _, b4:  _, b3:  _, b2:  T, b1:  T, b0:  T
    });

    expect(result).toEqual({
      // 11111111
      o23: T, o22: _, o21: T, o20: _, o19: T, o18: _, o17: _, o16: T,
      o15: T, o14: _, o13: _, o12: _, o11: T, o10: _, o9:  T, o8:  _,
      o7:  T, o6:  T, o5:  _, o4:  _, o3:  _, o2:  T, o1:  T, o0:  T,
      borrow: _
    });

    result = HDL.evaluate(describedChip, {
      // 1234567
      a23: _, a22: _, a21: _, a20: T, a19: _, a18: _, a17: T, a16: _,
      a15: T, a14: T, a13: _, a12: T, a11: _, a10: T, a9:  T, a8:  _,
      a7:  T, a6:  _, a5:  _, a4:  _, a3:  _, a2:  T, a1:  T, a0:  T,

      // 12345678
      b23: T, b22: _, b21: T, b20: T, b19: T, b18: T, b17: _, b16: _,
      b15: _, b14: T, b13: T, b12: _, b11: _, b10: _, b9:  _, b8:  T,
      b7:  _, b6:  T, b5:  _, b4:  _, b3:  T, b2:  T, b1:  T, b0:  _
    });

    expect(result).toEqual({
      // 5666105 (borrows)
      o23: _, o22: T, o21: _, o20: T, o19: _, o18: T, o17: T, o16: _,
      o15: _, o14: T, o13: T, o12: T, o11: _, o10: T, o9:  _, o8:  T,
      o7:  _, o6:  _, o5:  T, o4:  T, o3:  T, o2:  _, o1:  _, o0:  T,
      borrow: T
    });
  });
});
