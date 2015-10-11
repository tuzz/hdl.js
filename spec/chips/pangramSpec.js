"use strict";

var describedChip = "pangram";
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
    define("add_6");
    define("or");
    define("adder");
    define("half_adder");
    define("equal_6");
    define("xnor");
    define("xor");
    define("and");
    define("not");

    define("a_equal"); define("b_equal"); define("c_equal"); define("d_equal");
    define("e_equal"); define("f_equal"); define("g_equal"); define("h_equal");
    define("i_equal"); define("j_equal"); define("k_equal"); define("l_equal");
    define("m_equal"); define("n_equal"); define("o_equal"); define("p_equal");
    define("q_equal"); define("r_equal"); define("s_equal"); define("t_equal");
    define("u_equal"); define("v_equal"); define("w_equal"); define("x_equal");
    define("y_equal"); define("z_equal");

    define("a_sum"); define("b_sum"); define("c_sum"); define("d_sum");
    define("e_sum"); define("f_sum"); define("g_sum"); define("h_sum");
    define("i_sum"); define("j_sum"); define("k_sum"); define("l_sum");
    define("m_sum"); define("n_sum"); define("o_sum"); define("p_sum");
    define("q_sum"); define("r_sum"); define("s_sum"); define("t_sum");
    define("u_sum"); define("v_sum"); define("w_sum"); define("x_sum");
    define("y_sum"); define("z_sum");

    define("a_lookup"); define("b_lookup"); define("c_lookup");
    define("d_lookup"); define("e_lookup"); define("f_lookup");
    define("g_lookup"); define("h_lookup"); define("i_lookup");
    define("j_lookup"); define("k_lookup"); define("l_lookup");
    define("m_lookup"); define("n_lookup"); define("o_lookup");
    define("p_lookup"); define("q_lookup"); define("r_lookup");
    define("s_lookup"); define("t_lookup"); define("u_lookup");
    define("v_lookup"); define("w_lookup"); define("x_lookup");
    define("y_lookup"); define("z_lookup");
  });

  it("behaves as expected", function () {
    var _ = false;
    var T = true;

    /*

       This pangram lists four a’s, one b, one c, two d’s, twenty-nine e’,
       eight f’s, three g’s, five h’s, eleven i’s, one j, one k, three l’s,
       two m’s, twenty-two n’s, fifteen o’s, two p’s, one q, seven r’s,
       twenty-six s’s, nineteen t’s, four u’s, five v’s, nine w’s, two x’s,
       and one z.

    */

    var result = HDL.evaluate(describedChip, {
      a5: _, a4: _, a3: _, a2: T, a1: _, a0: _, // four a's
      b5: _, b4: _, b3: _, b2: _, b1: _, b0: T, // one b
      c5: _, c4: _, c3: _, c2: _, c1: _, c0: T, // one c
      d5: _, d4: _, d3: _, d2: _, d1: T, d0: _, // two d's
      e5: _, e4: T, e3: T, e2: T, e1: _, e0: T, // twenty-nine e's
      f5: _, f4: _, f3: T, f2: _, f1: _, f0: _, // eight f's
      g5: _, g4: _, g3: _, g2: _, g1: T, g0: T, // three g's
      h5: _, h4: _, h3: _, h2: T, h1: _, h0: T, // five h's
      i5: _, i4: _, i3: T, i2: _, i1: T, i0: T, // eleven i's
      j5: _, j4: _, j3: _, j2: _, j1: _, j0: T, // one j
      k5: _, k4: _, k3: _, k2: _, k1: _, k0: T, // one k
      l5: _, l4: _, l3: _, l2: _, l1: T, l0: T, // three l's
      m5: _, m4: _, m3: _, m2: _, m1: T, m0: _, // two m's
      n5: _, n4: T, n3: _, n2: T, n1: T, n0: _, // twenty-two n's
      o5: _, o4: _, o3: T, o2: T, o1: T, o0: T, // fifteen o's
      p5: _, p4: _, p3: _, p2: _, p1: T, p0: _, // two p's
      q5: _, q4: _, q3: _, q2: _, q1: _, q0: T, // one q
      r5: _, r4: _, r3: _, r2: T, r1: T, r0: T, // seven r's
      s5: _, s4: T, s3: T, s2: _, s1: T, s0: _, // twenty-six s's
      t5: _, t4: T, t3: _, t2: _, t1: T, t0: T, // nineteen t's
      u5: _, u4: _, u3: _, u2: T, u1: _, u0: _, // four u's
      v5: _, v4: _, v3: _, v2: T, v1: _, v0: T, // five v's
      w5: _, w4: _, w3: T, w2: _, w1: _, w0: T, // nine w's
      x5: _, x4: _, x3: _, x2: _, x1: T, x0: _, // two x's
      y5: _, y4: _, y3: _, y2: T, y1: _, y0: _, // four y's
      z5: _, z4: _, z3: _, z2: _, z1: _, z0: T, // one z

      // This pangram lists, and

      seed_a5: _, seed_a4: _, seed_a3: _, seed_a2: _, seed_a1: T, seed_a0: T,
      seed_b5: _, seed_b4: _, seed_b3: _, seed_b2: _, seed_b1: _, seed_b0: _,
      seed_c5: _, seed_c4: _, seed_c3: _, seed_c2: _, seed_c1: _, seed_c0: _,
      seed_d5: _, seed_d4: _, seed_d3: _, seed_d2: _, seed_d1: _, seed_d0: T,
      seed_e5: _, seed_e4: _, seed_e3: _, seed_e2: _, seed_e1: _, seed_e0: _,
      seed_f5: _, seed_f4: _, seed_f3: _, seed_f2: _, seed_f1: _, seed_f0: _,
      seed_g5: _, seed_g4: _, seed_g3: _, seed_g2: _, seed_g1: _, seed_g0: T,
      seed_h5: _, seed_h4: _, seed_h3: _, seed_h2: _, seed_h1: _, seed_h0: T,
      seed_i5: _, seed_i4: _, seed_i3: _, seed_i2: _, seed_i1: T, seed_i0: _,
      seed_j5: _, seed_j4: _, seed_j3: _, seed_j2: _, seed_j1: _, seed_j0: _,
      seed_k5: _, seed_k4: _, seed_k3: _, seed_k2: _, seed_k1: _, seed_k0: _,
      seed_l5: _, seed_l4: _, seed_l3: _, seed_l2: _, seed_l1: _, seed_l0: T,
      seed_m5: _, seed_m4: _, seed_m3: _, seed_m2: _, seed_m1: _, seed_m0: T,
      seed_n5: _, seed_n4: _, seed_n3: _, seed_n2: _, seed_n1: T, seed_n0: _,
      seed_o5: _, seed_o4: _, seed_o3: _, seed_o2: _, seed_o1: _, seed_o0: _,
      seed_p5: _, seed_p4: _, seed_p3: _, seed_p2: _, seed_p1: _, seed_p0: T,
      seed_q5: _, seed_q4: _, seed_q3: _, seed_q2: _, seed_q1: _, seed_q0: _,
      seed_r5: _, seed_r4: _, seed_r3: _, seed_r2: _, seed_r1: _, seed_r0: T,
      seed_s5: _, seed_s4: _, seed_s3: _, seed_s2: _, seed_s1: T, seed_s0: T,
      seed_t5: _, seed_t4: _, seed_t3: _, seed_t2: _, seed_t1: T, seed_t0: _,
      seed_u5: _, seed_u4: _, seed_u3: _, seed_u2: _, seed_u1: _, seed_u0: _,
      seed_v5: _, seed_v4: _, seed_v3: _, seed_v2: _, seed_v1: _, seed_v0: _,
      seed_w5: _, seed_w4: _, seed_w3: _, seed_w2: _, seed_w1: _, seed_w0: _,
      seed_x5: _, seed_x4: _, seed_x3: _, seed_x2: _, seed_x1: _, seed_x0: _,
      seed_y5: _, seed_y4: _, seed_y3: _, seed_y2: _, seed_y1: _, seed_y0: _,
      seed_z5: _, seed_z4: _, seed_z3: _, seed_z2: _, seed_z1: _, seed_z0: _
    });

    expect(result).toEqual({ out: true });
  });
});
