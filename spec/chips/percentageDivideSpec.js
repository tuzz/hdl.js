"use strict";

var describedChip = "percentage_divide";
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
    define("multiply_by_100");
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

      // 3000 divisor
      d11: T, d10: _, d9: T, d8: T, d7: T, d6: _,
      d5:  T, d4:  T, d3: T, d2: _, d1: _, d0: _
    });

    expect(result).toEqual({
      // 33.3 quotient
      a5: T, a4: _, a3: _, a2: _, a1: _, a0: T, // 33
                    b3: _, b2: _, b1: T, b0: T, // 3
      overflow: _
    });

    result = HDL.evaluate(describedChip, {
      // 300 numerator
      n11: _, n10: _, n9: _, n8: T, n7: _, n6: _,
      n5:  T, n4:  _, n3: T, n2: T, n1: _, n0: _,

      // 710 divisor
      d11: _, d10: _, d9: T, d8: _, d7: T, d6: T,
      d5:  _, d4:  _, d3: _, d2: T, d1: T, d0: _
    });

    expect(result).toEqual({
      // 42.3 quotient
      a5: T, a4: _, a3: T, a2: _, a1: T, a0: _, // 42
                    b3: _, b2: _, b1: T, b0: T, // 3
      overflow: _
    });

    result = HDL.evaluate(describedChip, {
      // 30 numerator
      n11: _, n10: _, n9: _, n8: _, n7: _, n6: _,
      n5:  _, n4:  T, n3: T, n2: T, n1: T, n0: _,

      // 3003 divisor
      d11: T, d10: _, d9: T, d8: T, d7: T, d6: _,
      d5:  T, d4:  T, d3: T, d2: _, d1: T, d0: T,
    });

    expect(result).toEqual({
      // 1.0 quotient (rounded from 0.99)
      a5: _, a4: _, a3: _, a2: _, a1: _, a0: T, // 1
                    b3: _, b2: _, b1: _, b0: _, // 0
      overflow: _
    });

    result = HDL.evaluate(describedChip, {
      // 30 numerator
      n11: _, n10: _, n9: _, n8: _, n7: _, n6: _,
      n5:  _, n4:  T, n3: T, n2: T, n1: T, n0: _,

      // 1200 divisor
      d11: _, d10: T, d9: _, d8: _, d7: T, d6: _,
      d5:  T, d4:  T, d3: _, d2: _, d1: _, d0: _,
    });

    expect(result).toEqual({
      // 2.5 quotient
      a5: _, a4: _, a3: _, a2: _, a1: T, a0: _, // 2
                    b3: _, b2: T, b1: _, b0: T, // 5
      overflow: _
    });

    result = HDL.evaluate(describedChip, {
      // 400 numerator
      n11: _, n10: _, n9: _, n8: T, n7: T, n6: _,
      n5:  _, n4:  T, n3: _, n2: _, n1: _, n0: _,

      // 600 divisor
      d11: _, d10: _, d9: T, d8: _, d7: _, d6: T,
      d5:  _, d4:  T, d3: T, d2: _, d1: _, d0: _,
    });

    expect(result).toEqual({
      // 2.7 quotient (overflows 64)
      a5: _, a4: _, a3: _, a2: _, a1: T, a0: _, // 2
                    b3: _, b2: T, b1: T, b0: T, // 7
      overflow: T
    });
  });
});
