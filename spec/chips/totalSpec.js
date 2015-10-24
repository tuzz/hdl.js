"use strict";

var describedChip = "total";
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
      a11: T, a10: _, a9: _, a8: _, a7: _, a6: _, a5: _, a4: _, a3: _, a2: _, a1: _, a0: _, // 2048
      b11: _, b10: _, b9: T, b8: _, b7: _, b6: _, b5: _, b4: _, b3: _, b2: _, b1: _, b0: _, // 512
      c11: _, c10: _, c9: _, c8: _, c7: T, c6: _, c5: _, c4: _, c3: _, c2: _, c1: _, c0: _, // 128
      d11: _, d10: _, d9: _, d8: _, d7: _, d6: _, d5: T, d4: _, d3: _, d2: _, d1: _, d0: _, // 32
      e11: _, e10: _, e9: _, e8: _, e7: _, e6: _, e5: _, e4: _, e3: T, e2: _, e1: _, e0: _, // 8
      f11: _, f10: _, f9: _, f8: _, f7: _, f6: _, f5: _, f4: _, f3: _, f2: _, f1: T, f0: _, // 2
      g11: _, g10: _, g9: _, g8: _, g7: _, g6: _, g5: _, g4: _, g3: _, g2: _, g1: _, g0: T, // 1
      h11: _, h10: _, h9: _, h8: _, h7: _, h6: _, h5: _, h4: _, h3: _, h2: _, h1: T, h0: _, // 2
      i11: _, i10: _, i9: _, i8: _, i7: _, i6: _, i5: _, i4: _, i3: _, i2: T, i1: _, i0: _, // 4
      j11: _, j10: _, j9: _, j8: _, j7: _, j6: _, j5: _, j4: _, j3: T, j2: _, j1: _, j0: _, // 8
      k11: _, k10: _, k9: _, k8: _, k7: _, k6: _, k5: _, k4: T, k3: _, k2: _, k1: _, k0: _, // 16
      l11: _, l10: _, l9: _, l8: _, l7: _, l6: _, l5: _, l4: T, l3: _, l2: _, l1: _, l0: _, // 16
      m11: _, m10: _, m9: _, m8: _, m7: _, m6: _, m5: _, m4: T, m3: _, m2: _, m1: _, m0: _, // 16
      n11: _, n10: _, n9: _, n8: _, n7: _, n6: _, n5: _, n4: T, n3: _, n2: _, n1: _, n0: _, // 16
      o11: _, o10: _, o9: _, o8: _, o7: _, o6: _, o5: _, o4: _, o3: T, o2: _, o1: _, o0: _, // 8
      p11: _, p10: _, p9: _, p8: _, p7: _, p6: _, p5: _, p4: _, p3: _, p2: T, p1: _, p0: _, // 4
      q11: _, q10: _, q9: _, q8: _, q7: _, q6: _, q5: _, q4: _, q3: _, q2: _, q1: T, q0: _, // 2
      r11: _, r10: _, r9: _, r8: _, r7: _, r6: _, r5: _, r4: _, r3: _, r2: _, r1: _, r0: T, // 1
      s11: _, s10: _, s9: _, s8: _, s7: _, s6: _, s5: T, s4: T, s3: T, s2: T, s1: T, s0: _, // 62
      t11: _, t10: _, t9: _, t8: _, t7: _, t6: _, t5: T, t4: _, t3: _, t2: _, t1: _, t0: _, // 32
      u11: _, u10: _, u9: _, u8: _, u7: _, u6: _, u5: T, u4: _, u3: _, u2: _, u1: _, u0: _, // 32
      v11: _, v10: _, v9: _, v8: _, v7: _, v6: T, v5: _, v4: _, v3: _, v2: _, v1: _, v0: _, // 64
      w11: _, w10: _, w9: _, w8: _, w7: T, w6: _, w5: _, w4: _, w3: _, w2: _, w1: _, w0: _, // 128
      x11: _, x10: _, x9: _, x8: T, x7: _, x6: _, x5: _, x4: _, x3: _, x2: _, x1: _, x0: _, // 256
      y11: _, y10: _, y9: T, y8: _, y7: _, y6: _, y5: _, y4: _, y3: _, y2: _, y1: _, y0: _, // 512
      z11: _, z10: _, z9: _, z8: _, z7: T, z6: _, z5: _, z4: _, z3: _, z2: _, z1: _, z0: _, // 128
    });

    expect(result).toEqual({
      // 4038
      sum11: T, sum10: T, sum9: T, sum8: T, sum7: T, sum6: T,
      sum5: _, sum4: _, sum3: _, sum2: T, sum1: T, sum0: _,
      carry: _
    });
  });
});
