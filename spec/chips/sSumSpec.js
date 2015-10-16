"use strict";

var describedChip = "s_sum";
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
    define("lookup_adder");
    define("s_lookup");
    define("add_6");
    define("or");
    define("adder");
    define("half_adder");
    define("xor");
  });

  it("behaves as expected", function () {
    var _ = false;
    var T = true;

    var result = HDL.evaluate(describedChip, {
      a5: _, a4: _, a3: _, a2: _, a1: _, a0: _, // zero a's          = 1
      b5: _, b4: _, b3: _, b2: _, b1: _, b0: T, // one b             = 0
      c5: _, c4: _, c3: _, c2: _, c1: T, c0: _, // two c's           = 1
      d5: _, d4: _, d3: _, d2: _, d1: T, d0: T, // three d's         = 1
      e5: _, e4: _, e3: _, e2: T, e1: _, e0: _, // four e's          = 1
      f5: _, f4: _, f3: _, f2: T, f1: _, f0: T, // five f's          = 1
      g5: _, g4: _, g3: _, g2: T, g1: T, g0: _, // six g's           = 2
      h5: _, h4: _, h3: _, h2: T, h1: T, h0: T, // seven h's         = 2
      i5: _, i4: _, i3: T, i2: _, i1: _, i0: _, // eight i's         = 1
      j5: _, j4: _, j3: T, j2: _, j1: _, j0: T, // nine j's          = 1
      k5: _, k4: _, k3: T, k2: _, k1: T, k0: _, // ten k's           = 1
      l5: _, l4: _, l3: T, l2: _, l1: T, l0: T, // eleven l's        = 1
      m5: _, m4: _, m3: T, m2: T, m1: _, m0: _, // twelve m's        = 1
      n5: _, n4: _, n3: T, n2: T, n1: _, n0: T, // thirteen n's      = 1
      o5: _, o4: _, o3: T, o2: T, o1: T, o0: _, // fourteen o's      = 1
      p5: _, p4: _, p3: T, p2: T, p1: T, p0: T, // fifteen p's       = 1
      q5: _, q4: T, q3: _, q2: _, q1: _, q0: _, // sixteen q's       = 2
      r5: _, r4: T, r3: _, r2: _, r1: _, r0: T, // seventeen r's     = 2
      s5: _, s4: T, s3: _, s2: _, s1: T, s0: _, // eighteen s's      = 2
      t5: _, t4: T, t3: _, t2: _, t1: T, t0: T, // nineteen t's      = 1
      u5: _, u4: T, u3: _, u2: T, u1: _, u0: _, // twenty u's        = 1
      v5: _, v4: T, v3: _, v2: T, v1: _, v0: T, // twenty-one v's    = 1
      w5: _, w4: T, w3: _, w2: T, w1: T, w0: _, // twenty-two w's    = 1
      x5: _, x4: T, x3: _, x2: T, x1: T, x0: T, // twenty-three x's  = 1
      y5: T, y4: _, y3: _, y2: _, y1: T, y0: _, // thirty-four y's   = 1
      z5: T, z4: _, z3: _, z2: _, z1: T, z0: T, // thirty-five z's   = 1

      seed5: _,                                 //                   = 0
      seed4: T,                                 //                   = 16
      seed3: _,                                 //                   = 0
      seed2: T,                                 //                   = 4
      seed1: _,                                 //                   = 0
      seed0: T                                  //                   = 1

                                                //              Total: 51
    });

    expect(result).toEqual({
      sum5: T, sum4: T, sum3: _, sum2: _, sum1: T, sum0: T, carry: _
    });
  });
});
