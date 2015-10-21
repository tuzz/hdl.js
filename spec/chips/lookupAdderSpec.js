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
    define("or");
    define("xor");
    define("half_adder");
    define("adder");
    define("add_12");
    define(describedChip);
  });

  it("behaves as expected", function () {
    var _ = false;
    var T = true;

    var result = HDL.evaluate(describedChip, {
      a2: _, a1: _, a0: T ,  // 1
      b2: _, b1: T , b0: _,  // 2
      c2: _, c1: T , c0: T , // 3
      d2: T , d1: _, d0: _,  // 4
      e2: T , e1: T , e0: _, // 6
      f2: _, f1: T , f0: _,  // 2
      g2: _, g1: _, g0: _,   // 0
      h2: _, h1: _, h0: _,   // 0
      i2: _, i1: _, i0: T ,  // 1
      j2: T , j1: _, j0: _,  // 4
      k2: T , k1: _, k0: T , // 5
      l2: _, l1: T , l0: _,  // 2
      m2: _, m1: T , m0: _,  // 2
      n2: _, n1: T , n0: T , // 3
      o2: _, o1: _, o0: T ,  // 1
      p2: T , p1: _, p0: T , // 5
      q2: _, q1: _, q0: _,   // 0
      r2: _, r1: _, r0: T ,  // 1
      s2: _, s1: _, s0: _,   // 0
      t2: _, t1: T , t0: T , // 3
      u2: _, u1: T , u0: T , // 3
      v2: _, v1: _, v0: T ,  // 1
      w2: _, w1: _, w0: T ,  // 1
      x2: _, x1: T , x0: _,  // 2
      y2: _, y1: _, y0: _,   // 0
      z2: _, z1: T , z0: _   // 2
                             // = 54
    });

    expect(result).toEqual({
      sum11: _,  // 2048 * 0
      sum10: _,  // 1024 * 0
      sum9: _,   // 512  * 0
      sum8: _,   // 256  * 0
      sum7: _,   // 128  * 0
      sum6: _,   // 64   * 0
      sum5: T,   // 32   * 1
      sum4: T,   // 16   * 1
      sum3: _,   // 08   * 0
      sum2: T,   // 04   * 1
      sum1: T,   // 02   * 1
      sum0: _,   // 01   * 0
                 //      = 54
    });

    result = HDL.evaluate(describedChip, {
      a2: T , a1: T , a0: T , // 7
      b2: T , b1: T , b0: _,  // 6
      c2: T , c1: _, c0: T ,  // 5
      d2: T , d1: _, d0: _,   // 4
      e2: _, e1: T , e0: T ,  // 3
      f2: _, f1: T , f0: _,   // 2
      g2: _, g1: _, g0: T ,   // 1
      h2: _, h1: _, h0: _,    // 0
      i2: _, i1: _, i0: T ,   // 1
      j2: _, j1: T , j0: _,   // 2
      k2: _, k1: T , k0: T ,  // 3
      l2: T , l1: _, l0: _,   // 4
      m2: T , m1: _, m0: T ,  // 5
      n2: T , n1: T , n0: _,  // 6
      o2: T , o1: T , o0: T , // 7
      p2: T , p1: T , p0: _,  // 6
      q2: T , q1: _, q0: T ,  // 5
      r2: T , r1: _, r0: _,   // 4
      s2: _, s1: T , s0: T ,  // 3
      t2: _, t1: T , t0: _,   // 2
      u2: _, u1: _, u0: T ,   // 1
      v2: _, v1: _, v0: _,    // 0
      w2: _, w1: _, w0: T ,   // 1
      x2: _, x1: T , x0: _,   // 2
      y2: _, y1: T , y0: T ,  // 3
      z2: T , z1: _, z0: _    // 4
                              // = 87
    });

    expect(result).toEqual({
      sum11: _,  // 2048 * 0
      sum10: _,  // 1024 * 0
      sum9: _,   // 512  * 0
      sum8: _,   // 256  * 0
      sum7: _,   // 128  * 0
      sum6: T,   // 64   * 0
      sum5: _,   // 32   * 0
      sum4: T,   // 16   * 1
      sum3: _,   // 08   * 0
      sum2: T,   // 04   * 1
      sum1: T,   // 02   * 1
      sum0: T,   // 01   * 1
                 //      = 87
    });
  });
});
