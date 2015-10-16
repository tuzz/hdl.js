"use strict";

var describedChip = "lookup_adder";
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
    define("add_6");
    define("or");
    define("adder");
    define("half_adder");
    define("xor");
  });

  it("behaves as expected", function () {
    var result = HDL.evaluate(describedChip, {
      a2: false, a1: false, a0: true , // 1
      b2: false, b1: true , b0: false, // 2
      c2: false, c1: true , c0: true , // 3
      d2: true , d1: false, d0: false, // 4
      e2: true , e1: true , e0: false, // 6
      f2: false, f1: true , f0: false, // 2
      g2: false, g1: false, g0: false, // 0
      h2: false, h1: false, h0: false, // 0
      i2: false, i1: false, i0: true , // 1
      j2: true , j1: false, j0: false, // 4
      k2: true , k1: false, k0: true , // 5
      l2: false, l1: true , l0: false, // 2
      m2: false, m1: true , m0: false, // 2
      n2: false, n1: true , n0: true , // 3
      o2: false, o1: false, o0: true , // 1
      p2: true , p1: false, p0: true , // 5
      q2: false, q1: false, q0: false, // 0
      r2: false, r1: false, r0: true , // 1
      s2: false, s1: false, s0: false, // 0
      t2: false, t1: true , t0: true , // 3
      u2: false, u1: true , u0: true , // 3
      v2: false, v1: false, v0: true , // 1
      w2: false, w1: false, w0: true , // 1
      x2: false, x1: true , x0: false, // 2
      y2: false, y1: false, y0: false, // 0
      z2: false, z1: true , z0: false  // 2
                                       // = 54
    });

    expect(result).toEqual({
      sum5: true,  // 32 * 1
      sum4: true,  // 16 * 1
      sum3: false, // 08 * 0
      sum2: true,  // 04 * 1
      sum1: true,  // 02 * 1
      sum0: false, // 01 * 0
                   //         = 54
      carry: false
    });

    result = HDL.evaluate(describedChip, {
      a2: true , a1: true , a0: true , // 7
      b2: true , b1: true , b0: false, // 6
      c2: true , c1: false, c0: true , // 5
      d2: true , d1: false, d0: false, // 4
      e2: false, e1: true , e0: true , // 3
      f2: false, f1: true , f0: false, // 2
      g2: false, g1: false, g0: true , // 1
      h2: false, h1: false, h0: false, // 0
      i2: false, i1: false, i0: true , // 1
      j2: false, j1: true , j0: false, // 2
      k2: false, k1: true , k0: true , // 3
      l2: true , l1: false, l0: false, // 4
      m2: true , m1: false, m0: true , // 5
      n2: true , n1: true , n0: false, // 6
      o2: true , o1: true , o0: true , // 7
      p2: true , p1: true , p0: false, // 6
      q2: true , q1: false, q0: true , // 5
      r2: true , r1: false, r0: false, // 4
      s2: false, s1: true , s0: true , // 3
      t2: false, t1: true , t0: false, // 2
      u2: false, u1: false, u0: true , // 1
      v2: false, v1: false, v0: false, // 0
      w2: false, w1: false, w0: true , // 1
      x2: false, x1: true , x0: false, // 2
      y2: false, y1: true , y0: true , // 3
      z2: true , z1: false, z0: false  // 4
                                       // = 87
    });

    expect(result).toEqual({
      sum5: false, // 32 * 0
      sum4: true,  // 16 * 1
      sum3: false, // 08 * 0
      sum2: true,  // 04 * 1
      sum1: true,  // 02 * 1
      sum0: true,  // 01 * 1
                   //         = 23 (carries)
      carry: true
    });
  });
});
