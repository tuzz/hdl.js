"use strict";

var describedChip = "csubtract_32";
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
    define("mux");
    define("not");
    define("or");
    define("half_subtractor");
    define("subtractor");
    define("subtract_32");
  });

  it("behaves as expected", function () {
    var _ = false;
    var T = true;

    var result = HDL.evaluate(describedChip, {
      // 11111111
      a31: _, a30: _, a29: _, a28: _, a27: _, a26: _, a25: _, a24: _,
      a23: T, a22: _, a21: T, a20: _, a19: T, a18: _, a17: _, a16: T,
      a15: T, a14: _, a13: _, a12: _, a11: T, a10: _, a9:  T, a8:  _,
      a7:  T, a6:  T, a5:  _, a4:  _, a3:  _, a2:  T, a1:  T, a0:  T,

      // 2222222
      b31: _, b30: _, b29: _, b28: _, b27: _, b26: _, b25: _, b24: _,
      b23: _, b22: _, b21: T, b20: _, b19: _, b18: _, b17: _, b16: T,
      b15: T, b14: T, b13: T, b12: _, b11: T, b10: _, b9:  _, b8:  _,
      b7:  T, b6:  _, b5:  _, b4:  _, b3:  T, b2:  T, b1:  T, b0:  _
    });

    expect(result).toEqual({
      // 8888889 because a > b is true
      o31: _, o30: _, o29: _, o28: _, o27: _, o26: _, o25: _, o24: _,
      o23: T, o22: _, o21: _, o20: _, o19: _, o18: T, o17: T, o16: T,
      o15: T, o14: _, o13: T, o12: _, o11: _, o10: _, o9:  T, o8:  _,
      o7:  _, o6:  _, o5:  T, o4:  T, o3:  T, o2:  _, o1:  _, o0:  T,
      subtracted: T
    });

    result = HDL.evaluate(describedChip, {
      // 1234567
      a31: _, a30: _, a29: _, a28: _, a27: _, a26: _, a25: _, a24: _,
      a23: _, a22: _, a21: _, a20: T, a19: _, a18: _, a17: T, a16: _,
      a15: T, a14: T, a13: _, a12: T, a11: _, a10: T, a9:  T, a8:  _,
      a7:  T, a6:  _, a5:  _, a4:  _, a3:  _, a2:  T, a1:  T, a0:  T,

      // 12345678
      b31: _, b30: _, b29: _, b28: _, b27: _, b26: _, b25: _, b24: _,
      b23: T, b22: _, b21: T, b20: T, b19: T, b18: T, b17: _, b16: _,
      b15: _, b14: T, b13: T, b12: _, b11: _, b10: _, b9:  _, b8:  T,
      b7:  _, b6:  T, b5:  _, b4:  _, b3:  T, b2:  T, b1:  T, b0:  _
    });

    expect(result).toEqual({
      // 1234567 because a > b is false
      o31: _, o30: _, o29: _, o28: _, o27: _, o26: _, o25: _, o24: _,
      o23: _, o22: _, o21: _, o20: T, o19: _, o18: _, o17: T, o16: _,
      o15: T, o14: T, o13: _, o12: T, o11: _, o10: T, o9:  T, o8:  _,
      o7:  T, o6:  _, o5:  _, o4:  _, o3:  _, o2:  T, o1:  T, o0:  T,
      subtracted: _
    });

    result = HDL.evaluate(describedChip, {
      // 4,000,000,000
      a31: T, a30: T, a29: T, a28: _, a27: T, a26: T, a25: T, a24: _,
      a23: _, a22: T, a21: T, a20: _, a19: T, a18: _, a17: T, a16: T,
      a15: _, a14: _, a13: T, a12: _, a11: T, a10: _, a9:  _, a8:  _,
      a7:  _, a6:  _, a5:  _, a4:  _, a3:  _, a2:  _, a1:  _, a0:  _,

      // 3,000,000,000
      b31: T, b30: _, b29: T, b28: T, b27: _, b26: _, b25: T, b24: _,
      b23: T, b22: T, b21: _, b20: T, b19: _, b18: _, b17: _, b16: _,
      b15: _, b14: T, b13: _, b12: T, b11: T, b10: T, b9:  T, b8:  _,
      b7:  _, b6:  _, b5:  _, b4:  _, b3:  _, b2:  _, b1:  _, b0:  _
    });

    expect(result).toEqual({
      // 1,000,000,000
      o31: _, o30: _, o29: T, o28: T, o27: T, o26: _, o25: T, o24: T,
      o23: T, o22: _, o21: _, o20: T, o19: T, o18: _, o17: T, o16: _,
      o15: T, o14: T, o13: _, o12: _, o11: T, o10: _, o9:  T, o8:  _,
      o7:  _, o6:  _, o5:  _, o4:  _, o3:  _, o2:  _, o1:  _, o0:  _,
      subtracted: T
    });
  });
});
