"use strict";

var describedChip = "decimal_divide";
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
    define("subtract_40");
    define("csubtract_40");
    define("divide_20");
    define("half_adder");
    define("adder");
    define("and");
    define("xor");
    define("less_than_5");
    define("add_6");
    define("multiply_by_10");
    define("equal_to_10");
    define("round_decimal");
  });

  it("behaves as expected", function () {
    var _ = false;
    var T = true;

    var result = HDL.evaluate(describedChip, {
      // 1000 numerator
      n11: _, n10: _, n9: T, n8: T, n7: T, n6: T,
      n5:  T, n4:  _, n3: T, n2: _, n1: _, n0: _,

      // 30 divisor
      d11: _, d10: _, d9: _, d8: _, d7: _, d6: _,
      d5:  _, d4:  T, d3: T, d2: T, d1: T, d0: _
    });

    expect(result).toEqual({
      // 33.33 quotient
      a5: T, a4: _, a3: _, a2: _, a1: _, a0: T, // 33
                    b3: _, b2: _, b1: T, b0: T, // 3
                    c3: _, c2: _, c1: T, c0: T, // 3
      overflow: _
    });

    result = HDL.evaluate(describedChip, {
      // 3000 numerator
      n11: T, n10: _, n9: T, n8: T, n7: T, n6: _,
      n5:  T, n4:  T, n3: T, n2: _, n1: _, n0: _,

      // 71 divisor
      d11: _, d10: _, d9: _, d8: _, d7: _, d6: T,
      d5:  _, d4:  _, d3: _, d2: T, d1: T, d0: T
    });

    expect(result).toEqual({
      // 42.25 quotient
      a5: T, a4: _, a3: T, a2: _, a1: T, a0: _, // 42
                    b3: _, b2: _, b1: T, b0: _, // 2
                    c3: _, c2: T, c1: _, c0: T, // 5
      overflow: _
    });

    // In this example, the third significant figure needs to be rounded.
    result = HDL.evaluate(describedChip, {
      // 3000 numerator
      n11: T, n10: _, n9: T, n8: T, n7: T, n6: _,
      n5:  T, n4:  T, n3: T, n2: _, n1: _, n0: _,

      // 70 divisor
      d11: _, d10: _, d9: _, d8: _, d7: _, d6: T,
      d5:  _, d4:  _, d3: _, d2: T, d1: T, d0: _
    });

    expect(result).toEqual({
      // 42.86 quotient (rounded 5 -> 6)
      a5: T, a4: _, a3: T, a2: _, a1: T, a0: _, // 42
                    b3: T, b2: _, b1: _, b0: _, // 8
                    c3: _, c2: T, c1: T, c0: _, // 6
      overflow: _
    });

    // In this example, rounding cascades to the 1st s.f.
    result = HDL.evaluate(describedChip, {
      // 3000 numerator
      n11: T, n10: _, n9: T, n8: T, n7: T, n6: _,
      n5:  T, n4:  T, n3: T, n2: _, n1: _, n0: _,

      // 3003 divisor
      d11: T, d10: _, d9: T, d8: T, d7: T, d6: _,
      d5:  T, d4:  T, d3: T, d2: _, d1: T, d0: T,
    });

    expect(result).toEqual({
      // 1.00 quotient (rounded from 0.999)
      a5: _, a4: _, a3: _, a2: _, a1: _, a0: T, // 1
                    b3: _, b2: _, b1: _, b0: _, // 0
                    c3: _, c2: _, c1: _, c0: _, // 0
      overflow: _
    });

    result = HDL.evaluate(describedChip, {
      // 3000 numerator
      n11: T, n10: _, n9: T, n8: T, n7: T, n6: _,
      n5:  T, n4:  T, n3: T, n2: _, n1: _, n0: _,

      // 1200 divisor
      d11: _, d10: T, d9: _, d8: _, d7: T, d6: _,
      d5:  T, d4:  T, d3: _, d2: _, d1: _, d0: _,
    });

    expect(result).toEqual({
      // 2.50 quotient
      a5: _, a4: _, a3: _, a2: _, a1: T, a0: _, // 2
                    b3: _, b2: T, b1: _, b0: T, // 5
                    c3: _, c2: _, c1: _, c0: _, // 0
      overflow: _
    });

    result = HDL.evaluate(describedChip, {
      // 4000 numerator
      n11: T, n10: T, n9: T, n8: T, n7: T, n6: _,
      n5:  T, n4:  _, n3: _, n2: _, n1: _, n0: _,

      // 60 divisor
      d11: _, d10: _, d9: _, d8: _, d7: _, d6: _,
      d5:  T, d4:  T, d3: T, d2: T, d1: _, d0: _,
    });

    expect(result).toEqual({
      // 2.67 quotient (overflows 64)
      a5: _, a4: _, a3: _, a2: _, a1: T, a0: _, // 2
                    b3: _, b2: T, b1: T, b0: _, // 6
                    c3: _, c2: T, c1: T, c0: T, // 7
      overflow: T
    });
  });
});

