"use strict";

var describedChip = "divide_20";
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
  });

  it("behaves as expected", function () {
    var _ = false;
    var T = true;

    var result = HDL.evaluate(describedChip, {
      // 2345 numerator
      n19: _, n18: _, n17: _, n16: _,
      n15: _, n14: _, n13: _, n12: _,
      n11: T, n10: _, n9: _, n8: T, n7: _, n6: _,
      n5:  T, n4:  _, n3: T, n2: _, n1: _, n0: T,

      // 123 divisor
      d19: _, d18: _, d17: _, d16: _,
      d15: _, d14: _, d13: _, d12: _,
      d11: _, d10: _, d9: _, d8: _, d7: _, d6: T,
      d5:  T, d4:  T, d3: T, d2: _, d1: T, d0: T,
    });

    expect(result).toEqual({
      // 19 quotient
      q19: _, q18: _, q17: _, q16: _,
      q15: _, q14: _, q13: _, q12: _,
      q11: _, q10: _, q9: _, q8: _, q7: _, q6: _,
      q5:  _, q4:  T, q3: _, q2: _, q1: T, q0: T,

      // 8 remainder
      r19: _, r18: _, r17: _, r16: _,
      r15: _, r14: _, r13: _, r12: _,
      r11: _, r10: _, r9: _, r8: _, r7: _, r6: _,
      r5:  _, r4:  _, r3: T, r2: _, r1: _, r0: _,
    });

    result = HDL.evaluate(describedChip, {
      // 4000 numerator
      n19: _, n18: _, n17: _, n16: _,
      n15: _, n14: _, n13: _, n12: _,
      n11: T, n10: T, n9: T, n8: T, n7: T, n6: _,
      n5:  T, n4:  _, n3: _, n2: _, n1: _, n0: _,

      // 3 divisor
      d19: _, d18: _, d17: _, d16: _,
      d15: _, d14: _, d13: _, d12: _,
      d11: _, d10: _, d9: _, d8: _, d7: _, d6: _,
      d5:  _, d4:  _, d3: _, d2: _, d1: T, d0: T,
    });

    expect(result).toEqual({
      // 1333 quotient
      q19: _, q18: _, q17: _, q16: _,
      q15: _, q14: _, q13: _, q12: _,
      q11: _, q10: T, q9: _, q8: T, q7: _, q6: _,
      q5:  T, q4:  T, q3: _, q2: T, q1: _, q0: T,

      // 1 remainder
      r19: _, r18: _, r17: _, r16: _,
      r15: _, r14: _, r13: _, r12: _,
      r11: _, r10: _, r9: _, r8: _, r7: _, r6: _,
      r5:  _, r4:  _, r3: _, r2: _, r1: _, r0: T,
    });

    result = HDL.evaluate(describedChip, {
      // 4095 numerator
      n19: _, n18: _, n17: _, n16: _,
      n15: _, n14: _, n13: _, n12: _,
      n11: T, n10: T, n9: T, n8: T, n7: T, n6: T,
      n5:  T, n4:  T, n3: T, n2: T, n1: T, n0: T,

      // 4095 denominator
      d19: _, d18: _, d17: _, d16: _,
      d15: _, d14: _, d13: _, d12: _,
      d11: T, d10: T, d9: T, d8: T, d7: T, d6: T,
      d5:  T, d4:  T, d3: T, d2: T, d1: T, d0: T,
    });

    expect(result).toEqual({
      // 1 quotient
      q19: _, q18: _, q17: _, q16: _,
      q15: _, q14: _, q13: _, q12: _,
      q11: _, q10: _, q9: _, q8: _, q7: _, q6: _,
      q5:  _, q4:  _, q3: _, q2: _, q1: _, q0: T,

      // 0 remainder
      r19: _, r18: _, r17: _, r16: _,
      r15: _, r14: _, r13: _, r12: _,
      r11: _, r10: _, r9: _, r8: _, r7: _, r6: _,
      r5:  _, r4:  _, r3: _, r2: _, r1: _, r0: _,
    });

    result = HDL.evaluate(describedChip, {
      // 4094 numerator
      n19: _, n18: _, n17: _, n16: _,
      n15: _, n14: _, n13: _, n12: _,
      n11: T, n10: T, n9: T, n8: T, n7: T, n6: T,
      n5:  T, n4:  T, n3: T, n2: T, n1: T, n0: _,

      // 4095 denominator
      d19: _, d18: _, d17: _, d16: _,
      d15: _, d14: _, d13: _, d12: _,
      d11: T, d10: T, d9: T, d8: T, d7: T, d6: T,
      d5:  T, d4:  T, d3: T, d2: T, d1: T, d0: T,
    });

    expect(result).toEqual({
      // 0 quotient
      q19: _, q18: _, q17: _, q16: _,
      q15: _, q14: _, q13: _, q12: _,
      q11: _, q10: _, q9: _, q8: _, q7: _, q6: _,
      q5:  _, q4:  _, q3: _, q2: _, q1: _, q0: _,

      // 4094 remainder
      r19: _, r18: _, r17: _, r16: _,
      r15: _, r14: _, r13: _, r12: _,
      r11: T, r10: T, r9: T, r8: T, r7: T, r6: T,
      r5:  T, r4:  T, r3: T, r2: T, r1: T, r0: _,
    });

    result = HDL.evaluate(describedChip, {
      // 60000 numerator
      n19: _, n18: _, n17: _, n16: _,
      n15: T, n14: T, n13: T, n12: _,
      n11: T, n10: _, n9: T, n8: _, n7: _, n6: T,
      n5:  T, n4:  _, n3: _, n2: _, n1: _, n0: _,

      // 50000 denominator
      d19: _, d18: _, d17: _, d16: _,
      d15: T, d14: T, d13: _, d12: _,
      d11: _, d10: _, d9: T, d8: T, d7: _, d6: T,
      d5:  _, d4:  T, d3: _, d2: _, d1: _, d0: _,
    });

    expect(result).toEqual({
      // 1 quotient
      q19: _, q18: _, q17: _, q16: _,
      q15: _, q14: _, q13: _, q12: _,
      q11: _, q10: _, q9: _, q8: _, q7: _, q6: _,
      q5:  _, q4:  _, q3: _, q2: _, q1: _, q0: T,

      // 10000 remainder
      r19: _, r18: _, r17: _, r16: _,
      r15: _, r14: _, r13: T, r12: _,
      r11: _, r10: T, r9: T, r8: T, r7: _, r6: _,
      r5:  _, r4:  T, r3: _, r2: _, r1: _, r0: _,
    });

    result = HDL.evaluate(describedChip, {
      // 1000000 numerator
      n19: T, n18: T, n17: T, n16: T,
      n15: _, n14: T, n13: _, n12: _,
      n11: _, n10: _, n9: T, n8: _, n7: _, n6: T,
      n5:  _, n4:  _, n3: _, n2: _, n1: _, n0: _,

      // 243 denominator
      d19: _, d18: _, d17: _, d16: _,
      d15: _, d14: _, d13: _, d12: _,
      d11: _, d10: _, d9: _, d8: _, d7: T, d6: T,
      d5:  T, d4:  T, d3: _, d2: _, d1: T, d0: T,
    });

    expect(result).toEqual({
      // 4115 quotient
      q19: _, q18: _, q17: _, q16: _,
      q15: _, q14: _, q13: _, q12: T,
      q11: _, q10: _, q9: _, q8: _, q7: _, q6: _,
      q5:  _, q4:  T, q3: _, q2: _, q1: T, q0: T,

      // 55 remainder
      r19: _, r18: _, r17: _, r16: _,
      r15: _, r14: _, r13: _, r12: _,
      r11: _, r10: _, r9: _, r8: _, r7: _, r6: _,
      r5:  T, r4:  T, r3: _, r2: T, r1: T, r0: T,
    });
  });
});
