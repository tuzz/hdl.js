"use strict";

var describedChip = "e_sum";
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
    define("e_lookup");
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
      b5: _, b4: _, b3: _, b2: _, b1: _, b0: T, // one b             = 1
      c5: _, c4: _, c3: _, c2: _, c1: T, c0: _, // two c's           = 0
      d5: _, d4: _, d3: _, d2: _, d1: T, d0: T, // three d's         = 2
      e5: _, e4: _, e3: _, e2: T, e1: _, e0: _, // four e's          = 1
      f5: _, f4: _, f3: _, f2: T, f1: _, f0: T, // five f's          = 1
      g5: _, g4: _, g3: _, g2: T, g1: T, g0: _, // six g's           = 0
      h5: _, h4: _, h3: _, h2: T, h1: T, h0: T, // seven h's         = 2
      i5: _, i4: _, i3: T, i2: _, i1: _, i0: _, // eight i's         = 1
      j5: _, j4: _, j3: T, j2: _, j1: _, j0: T, // nine j's          = 1
      k5: _, k4: _, k3: T, k2: _, k1: T, k0: _, // ten k's           = 1
      l5: _, l4: _, l3: T, l2: _, l1: T, l0: T, // eleven l's        = 3
      m5: _, m4: _, m3: T, m2: T, m1: _, m0: _, // twelve m's        = 2
      n5: _, n4: _, n3: T, n2: T, n1: _, n0: T, // thirteen n's      = 2
      o5: _, o4: _, o3: T, o2: T, o1: T, o0: _, // fourteen o's      = 2
      p5: _, p4: _, p3: T, p2: T, p1: T, p0: T, // fifteen p's       = 2
      q5: _, q4: T, q3: _, q2: _, q1: _, q0: _, // sixteen q's       = 2
      r5: _, r4: T, r3: _, r2: _, r1: _, r0: T, // seventeen r's     = 4
      s5: _, s4: T, s3: _, s2: _, s1: T, s0: _, // eighteen s's      = 3
      t5: _, t4: T, t3: _, t2: _, t1: T, t0: T, // nineteen t's      = 3
      u5: _, u4: T, u3: _, u2: T, u1: _, u0: _, // twenty u's        = 1
      v5: _, v4: T, v3: _, v2: T, v1: _, v0: T, // twenty-one v's    = 2
      w5: _, w4: T, w3: _, w2: T, w1: T, w0: _, // twenty-two w's    = 1
      x5: _, x4: T, x3: _, x2: T, x1: T, x0: T, // twenty-three x's  = 3
      y5: T, y4: _, y3: _, y2: _, y1: T, y0: _, // thirty-four y's   = 0
      z5: T, z4: _, z3: _, z2: _, z1: T, z0: T  // thirty-five z's   = 1

                                                //                   = 42
    });

    expect(result).toEqual({
      sum5: T, sum4: _, sum3: T, sum2: _, sum1: T, sum0: _, carry: _
    });

    result = HDL.evaluate(describedChip, {
      a5: _, a4: T, a3: _, a2: _, a1: _, a0: T, // seventeen a's   = 4
      b5: _, b4: T, b3: _, b2: _, b1: _, b0: T, // seventeen b's   = 4
      c5: _, c4: T, c3: _, c2: _, c1: _, c0: T, // seventeen c's   = 4
      d5: _, d4: T, d3: _, d2: _, d1: _, d0: T, // seventeen d's   = 4
      e5: _, e4: T, e3: _, e2: _, e1: _, e0: T, // seventeen e's   = 5
      f5: _, f4: T, f3: _, f2: _, f1: _, f0: T, // seventeen f's   = 4
      g5: _, g4: T, g3: _, g2: _, g1: _, g0: T, // seventeen g's   = 4
      h5: _, h4: T, h3: _, h2: _, h1: _, h0: T, // seventeen h's   = 4
      i5: _, i4: T, i3: _, i2: _, i1: _, i0: T, // seventeen i's   = 4
      j5: _, j4: T, j3: _, j2: _, j1: _, j0: T, // seventeen j's   = 4
      k5: _, k4: T, k3: _, k2: _, k1: _, k0: T, // seventeen k's   = 4
      l5: _, l4: T, l3: _, l2: _, l1: _, l0: T, // seventeen l's   = 4
      m5: _, m4: T, m3: _, m2: _, m1: _, m0: T, // seventeen m's   = 4
      n5: _, n4: T, n3: _, n2: _, n1: _, n0: T, // seventeen n's   = 4
      o5: _, o4: T, o3: _, o2: _, o1: _, o0: T, // seventeen o's   = 4
      p5: _, p4: T, p3: _, p2: _, p1: _, p0: T, // seventeen p's   = 4
      q5: _, q4: T, q3: _, q2: _, q1: _, q0: T, // seventeen q's   = 4
      r5: _, r4: T, r3: _, r2: _, r1: _, r0: T, // seventeen r's   = 4
      s5: _, s4: T, s3: _, s2: _, s1: _, s0: T, // seventeen s's   = 4
      t5: _, t4: T, t3: _, t2: _, t1: _, t0: T, // seventeen t's   = 4
      u5: _, u4: T, u3: _, u2: _, u1: _, u0: T, // seventeen u's   = 4
      v5: _, v4: T, v3: _, v2: _, v1: _, v0: T, // seventeen v's   = 4
      w5: _, w4: T, w3: _, w2: _, w1: _, w0: T, // seventeen w's   = 4
      x5: _, x4: T, x3: _, x2: _, x1: _, x0: T, // seventeen x's   = 4
      y5: _, y4: T, y3: _, y2: _, y1: _, y0: T, // seventeen y's   = 4
      z5: _, z4: T, z3: _, z2: _, z1: _, z0: T  // seventeen z's   = 4

                                                //              = 41 (carries)
    });

    expect(result).toEqual({
      sum5: T, sum4: _, sum3: T, sum2: _, sum1: _, sum0: T, carry: T
    });
  });
});
