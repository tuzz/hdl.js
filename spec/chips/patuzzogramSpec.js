"use strict";

var describedChip = "patuzzogram";
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
    define("total");
    define(describedChip);

    define("a_lookup"); define("b_lookup"); define("c_lookup");
    define("d_lookup"); define("e_lookup"); define("f_lookup");
    define("g_lookup"); define("h_lookup"); define("i_lookup");
    define("j_lookup"); define("k_lookup"); define("l_lookup");
    define("m_lookup"); define("n_lookup"); define("o_lookup");
    define("p_lookup"); define("q_lookup"); define("r_lookup");
    define("s_lookup"); define("t_lookup"); define("u_lookup");
    define("v_lookup"); define("w_lookup"); define("x_lookup");
    define("y_lookup"); define("z_lookup");

    define("and");
    define("xor");
    define("not");
    define("is_zero");
    define("mux");
    define("half_adder");
    define("adder");
    define("add_6");
    define("add_12");
    define("lookup_adder");
    define("or");
    define("xnor");
    define("half_subtractor");
    define("subtractor");
    define("subtract_40");
    define("csubtract_40");
    define("divide_20");
    define("less_than_5");
    define("multiply_by_10");
    define("multiply_by_100");
    define("equal_to_10");
    define("round_decimal");
    define("percentage_divide");
    define("percent_equal");

    define("a_number"); define("b_number"); define("c_number");
    define("d_number"); define("e_number"); define("f_number");
    define("g_number"); define("h_number"); define("i_number");
    define("j_number"); define("k_number"); define("l_number");
    define("m_number"); define("n_number"); define("o_number");
    define("p_number"); define("q_number"); define("r_number");
    define("s_number"); define("t_number"); define("u_number");
    define("v_number"); define("w_number"); define("x_number");
    define("y_number"); define("z_number");

    define("a_sum"); define("b_sum"); define("c_sum"); define("d_sum");
    define("e_sum"); define("f_sum"); define("g_sum"); define("h_sum");
    define("i_sum"); define("j_sum"); define("k_sum"); define("l_sum");
    define("m_sum"); define("n_sum"); define("o_sum"); define("p_sum");
    define("q_sum"); define("r_sum"); define("s_sum"); define("t_sum");
    define("u_sum"); define("v_sum"); define("w_sum"); define("x_sum");
    define("y_sum"); define("z_sum");
  });

  it("behaves as expected", function () {
    var _ = false;
    var T = true;

    var result = HDL.evaluate(describedChip, {
      a_sf1_5: _, a_sf1_4: _, a_sf1_3: T, a_sf1_2: _, a_sf1_1: T, a_sf1_0: _, // ten
                                                                              // ____
      a_sf2_3: _, a_sf2_2: _, a_sf2_1: _, a_sf2_0: _,                         // ____
      a_sf3_3: _, a_sf3_2: _, a_sf3_1: _, a_sf3_0: _,                         // ____
                                                                              // percent
                                                                              // are a's

      b_sf1_5: _, b_sf1_4: _, b_sf1_3: _, b_sf1_2: _, b_sf1_1: T, b_sf1_0: _, // two
                                                                              // point
      b_sf2_3: _, b_sf2_2: T, b_sf2_1: T, b_sf2_0: T,                         // seven
      b_sf3_3: _, b_sf3_2: T, b_sf3_1: T, b_sf3_0: _,                         // six
                                                                              // percent
                                                                              // are b's

      c_sf1_5: _, c_sf1_4: _, c_sf1_3: _, c_sf1_2: _, c_sf1_1: T, c_sf1_0: T, // three
                                                                              // point
      c_sf2_3: _, c_sf2_2: T, c_sf2_1: _, c_sf2_0: T,                         // five
      c_sf3_3: _, c_sf3_2: T, c_sf3_1: _, c_sf3_0: _,                         // four
                                                                              // percent
                                                                              // are c's

      d_sf1_5: _, d_sf1_4: _, d_sf1_3: _, d_sf1_2: T, d_sf1_1: _, d_sf1_0: _, // four
                                                                              // point
      d_sf2_3: _, d_sf2_2: _, d_sf2_1: T, d_sf2_0: T,                         // three
      d_sf3_3: _, d_sf3_2: _, d_sf3_1: T, d_sf3_0: _,                         // two
                                                                              // percent
                                                                              // are d's

      e_sf1_5: _, e_sf1_4: _, e_sf1_3: _, e_sf1_2: T, e_sf1_1: _, e_sf1_0: T, // five
                                                                              // point
      e_sf2_3: _, e_sf2_2: _, e_sf2_1: _, e_sf2_0: T,                         // one
      e_sf3_3: _, e_sf3_2: _, e_sf3_1: _, e_sf3_0: _,                         // ____
                                                                              // percent
                                                                              // are e's

      f_sf1_5: _, f_sf1_4: _, f_sf1_3: _, f_sf1_2: T, f_sf1_1: T, f_sf1_0: _, // six
                                                                              // point
      f_sf2_3: T, f_sf2_2: _, f_sf2_1: _, f_sf2_0: T,                         // nine
      f_sf3_3: T, f_sf3_2: _, f_sf3_1: _, f_sf3_0: _,                         // eight
                                                                              // percent
                                                                              // are f's

      g_sf1_5: _, g_sf1_4: _, g_sf1_3: _, g_sf1_2: T, g_sf1_1: T, g_sf1_0: T, // seven
                                                                              // point
      g_sf2_3: _, g_sf2_2: T, g_sf2_1: T, g_sf2_0: T,                         // seven
      g_sf3_3: _, g_sf3_2: T, g_sf3_1: T, g_sf3_0: _,                         // six
                                                                              // percent
                                                                              // are g's

      h_sf1_5: _, h_sf1_4: _, h_sf1_3: T, h_sf1_2: _, h_sf1_1: _, h_sf1_0: _, // eight
                                                                              // point
      h_sf2_3: _, h_sf2_2: T, h_sf2_1: _, h_sf2_0: T,                         // five
      h_sf3_3: _, h_sf3_2: T, h_sf3_1: _, h_sf3_0: _,                         // four
                                                                              // percent
                                                                              // are h's

      i_sf1_5: _, i_sf1_4: _, i_sf1_3: T, i_sf1_2: _, i_sf1_1: _, i_sf1_0: T, // nine
                                                                              // point
      i_sf2_3: _, i_sf2_2: _, i_sf2_1: T, i_sf2_0: T,                         // three
      i_sf3_3: _, i_sf3_2: _, i_sf3_1: T, i_sf3_0: _,                         // two
                                                                              // percent
                                                                              // are i's

      j_sf1_5: _, j_sf1_4: _, j_sf1_3: T, j_sf1_2: _, j_sf1_1: T, j_sf1_0: _, // ten
                                                                              // point
      j_sf2_3: _, j_sf2_2: _, j_sf2_1: _, j_sf2_0: T,                         // one
      j_sf3_3: _, j_sf3_2: _, j_sf3_1: _, j_sf3_0: _,                         // ____
                                                                              // percent
                                                                              // are j's

      k_sf1_5: _, k_sf1_4: _, k_sf1_3: T, k_sf1_2: _, k_sf1_1: T, k_sf1_0: T, // eleven
                                                                              // point
      k_sf2_3: T, k_sf2_2: _, k_sf2_1: _, k_sf2_0: T,                         // nine
      k_sf3_3: T, k_sf3_2: _, k_sf3_1: _, k_sf3_0: _,                         // eight
                                                                              // percent
                                                                              // are k's

      l_sf1_5: _, l_sf1_4: _, l_sf1_3: T, l_sf1_2: T, l_sf1_1: _, l_sf1_0: _, // twelve
                                                                              // point
      l_sf2_3: _, l_sf2_2: T, l_sf2_1: T, l_sf2_0: T,                         // seven
      l_sf3_3: _, l_sf3_2: T, l_sf3_1: T, l_sf3_0: _,                         // six
                                                                              // percent
                                                                              // are l's

      m_sf1_5: _, m_sf1_4: _, m_sf1_3: T, m_sf1_2: T, m_sf1_1: _, m_sf1_0: T, // thirteen
                                                                              // ____
      m_sf2_3: _, m_sf2_2: _, m_sf2_1: _, m_sf2_0: _,                         // ____
      m_sf3_3: _, m_sf3_2: _, m_sf3_1: _, m_sf3_0: _,                         // ____
                                                                              // percent
                                                                              // are m's

      n_sf1_5: _, n_sf1_4: _, n_sf1_3: T, n_sf1_2: T, n_sf1_1: T, n_sf1_0: _, // fourteen
                                                                              // point
      n_sf2_3: _, n_sf2_2: _, n_sf2_1: T, n_sf2_0: T,                         // three
      n_sf3_3: _, n_sf3_2: _, n_sf3_1: T, n_sf3_0: _,                         // two
                                                                              // percent
                                                                              // are n's

      o_sf1_5: _, o_sf1_4: _, o_sf1_3: T, o_sf1_2: T, o_sf1_1: T, o_sf1_0: T, // fifteen
                                                                              // point
      o_sf2_3: _, o_sf2_2: _, o_sf2_1: _, o_sf2_0: T,                         // one
      o_sf3_3: _, o_sf3_2: _, o_sf3_1: _, o_sf3_0: _,                         // ____
                                                                              // percent
                                                                              // are o's

      p_sf1_5: _, p_sf1_4: T, p_sf1_3: _, p_sf1_2: _, p_sf1_1: _, p_sf1_0: _, // sixteen
                                                                              // point
      p_sf2_3: _, p_sf2_2: _, p_sf2_1: _, p_sf2_0: _,                         // zero
      p_sf3_3: _, p_sf3_2: T, p_sf3_1: _, p_sf3_0: T,                         // five
                                                                              // percent
                                                                              // are p's

      q_sf1_5: _, q_sf1_4: T, q_sf1_3: _, q_sf1_2: _, q_sf1_1: _, q_sf1_0: T, // seventeen
                                                                              // point
      q_sf2_3: _, q_sf2_2: T, q_sf2_1: T, q_sf2_0: T,                         // seven
      q_sf3_3: _, q_sf3_2: T, q_sf3_1: T, q_sf3_0: _,                         // six
                                                                              // percent
                                                                              // are q's

      r_sf1_5: _, r_sf1_4: T, r_sf1_3: _, r_sf1_2: _, r_sf1_1: T, r_sf1_0: _, // eighteen
                                                                              // point
      r_sf2_3: _, r_sf2_2: T, r_sf2_1: _, r_sf2_0: T,                         // five
      r_sf3_3: _, r_sf3_2: T, r_sf3_1: _, r_sf3_0: _,                         // four
                                                                              // percent
                                                                              // are r's

      s_sf1_5: _, s_sf1_4: T, s_sf1_3: _, s_sf1_2: _, s_sf1_1: T, s_sf1_0: T, // nineteen
                                                                              // point
      s_sf2_3: _, s_sf2_2: _, s_sf2_1: T, s_sf2_0: T,                         // three
      s_sf3_3: _, s_sf3_2: _, s_sf3_1: T, s_sf3_0: _,                         // two
                                                                              // percent
                                                                              // are s's

      t_sf1_5: _, t_sf1_4: T, t_sf1_3: _, t_sf1_2: T, t_sf1_1: _, t_sf1_0: _, // twenty
                                                                              // point
      t_sf2_3: _, t_sf2_2: _, t_sf2_1: _, t_sf2_0: T,                         // one
      t_sf3_3: _, t_sf3_2: _, t_sf3_1: _, t_sf3_0: _,                         // ____
                                                                              // percent
                                                                              // are t's

      u_sf1_5: _, u_sf1_4: T, u_sf1_3: _, u_sf1_2: T, u_sf1_1: _, u_sf1_0: T, // twenty-one
                                                                              // point
      u_sf2_3: T, u_sf2_2: _, u_sf2_1: _, u_sf2_0: T,                         // nine
      u_sf3_3: T, u_sf3_2: _, u_sf3_1: _, u_sf3_0: _,                         // eight
                                                                              // percent
                                                                              // are u's

      v_sf1_5: _, v_sf1_4: T, v_sf1_3: _, v_sf1_2: T, v_sf1_1: T, v_sf1_0: _, // twenty-two
                                                                              // point
      v_sf2_3: _, v_sf2_2: T, v_sf2_1: T, v_sf2_0: T,                         // seven
      v_sf3_3: _, v_sf3_2: T, v_sf3_1: T, v_sf3_0: _,                         // six
                                                                              // percent
                                                                              // are v's

      w_sf1_5: _, w_sf1_4: T, w_sf1_3: _, w_sf1_2: T, w_sf1_1: T, w_sf1_0: T, // twenty-three
                                                                              // ____
      w_sf2_3: _, w_sf2_2: _, w_sf2_1: _, w_sf2_0: _,                         // ____
      w_sf3_3: _, w_sf3_2: _, w_sf3_1: _, w_sf3_0: _,                         // ____
                                                                              // percent
                                                                              // are w's

      x_sf1_5: _, x_sf1_4: T, x_sf1_3: T, x_sf1_2: _, x_sf1_1: _, x_sf1_0: _, // twenty-four
                                                                              // point
      x_sf2_3: _, x_sf2_2: _, x_sf2_1: T, x_sf2_0: T,                         // three
      x_sf3_3: _, x_sf3_2: _, x_sf3_1: T, x_sf3_0: _,                         // two
                                                                              // percent
                                                                              // are x's

      y_sf1_5: _, y_sf1_4: T, y_sf1_3: T, y_sf1_2: _, y_sf1_1: _, y_sf1_0: T, // twenty-five
                                                                              // point
      y_sf2_3: _, y_sf2_2: _, y_sf2_1: _, y_sf2_0: T,                         // one
      y_sf3_3: _, y_sf3_2: _, y_sf3_1: _, y_sf3_0: _,                         // ____
                                                                              // percent
                                                                              // are y's

      z_sf1_5: _, z_sf1_4: T, z_sf1_3: T, z_sf1_2: _, z_sf1_1: T, z_sf1_0: _, // twenty-six
                                                                              // point
      z_sf2_3: T, z_sf2_2: _, z_sf2_1: _, z_sf2_0: T,                         // nine
      z_sf3_3: T, z_sf3_2: _, z_sf3_1: _, z_sf3_0: _,                         // eight
                                                                              // percent
                                                                              // are z's

                                                                              // 760 letters

      seed_a5: T, seed_a4: T, seed_a3: _, seed_a2: T, seed_a1: T, seed_a0: T, // + 55 a's
      seed_b5: _, seed_b4: _, seed_b3: _, seed_b2: T, seed_b1: _, seed_b0: T, // + 5 b's
      seed_c5: _, seed_c4: _, seed_c3: _, seed_c2: _, seed_c1: _, seed_c0: _,
      seed_d5: _, seed_d4: _, seed_d3: _, seed_d2: _, seed_d1: _, seed_d0: _,
      seed_e5: _, seed_e4: _, seed_e3: _, seed_e2: _, seed_e1: _, seed_e0: _,
      seed_f5: _, seed_f4: _, seed_f3: _, seed_f2: _, seed_f1: _, seed_f0: _,
      seed_g5: _, seed_g4: _, seed_g3: _, seed_g2: _, seed_g1: _, seed_g0: _,
      seed_h5: _, seed_h4: _, seed_h3: _, seed_h2: _, seed_h1: _, seed_h0: _,
      seed_i5: _, seed_i4: _, seed_i3: _, seed_i2: _, seed_i1: _, seed_i0: _,
      seed_j5: _, seed_j4: _, seed_j3: _, seed_j2: _, seed_j1: _, seed_j0: _,
      seed_k5: _, seed_k4: _, seed_k3: _, seed_k2: _, seed_k1: _, seed_k0: _,
      seed_l5: _, seed_l4: _, seed_l3: _, seed_l2: _, seed_l1: _, seed_l0: _,
      seed_m5: _, seed_m4: _, seed_m3: _, seed_m2: _, seed_m1: _, seed_m0: _,
      seed_n5: _, seed_n4: _, seed_n3: _, seed_n2: _, seed_n1: _, seed_n0: _,
      seed_o5: _, seed_o4: _, seed_o3: _, seed_o2: _, seed_o1: _, seed_o0: _,
      seed_p5: _, seed_p4: _, seed_p3: _, seed_p2: _, seed_p1: _, seed_p0: _,
      seed_q5: _, seed_q4: _, seed_q3: _, seed_q2: _, seed_q1: _, seed_q0: _,
      seed_r5: _, seed_r4: _, seed_r3: _, seed_r2: _, seed_r1: _, seed_r0: _,
      seed_s5: _, seed_s4: _, seed_s3: _, seed_s2: _, seed_s1: _, seed_s0: _,
      seed_t5: _, seed_t4: _, seed_t3: _, seed_t2: _, seed_t1: _, seed_t0: _,
      seed_u5: _, seed_u4: _, seed_u3: _, seed_u2: _, seed_u1: _, seed_u0: _,
      seed_v5: _, seed_v4: _, seed_v3: _, seed_v2: _, seed_v1: _, seed_v0: _,
      seed_w5: _, seed_w4: _, seed_w3: _, seed_w2: _, seed_w1: _, seed_w0: _,
      seed_x5: _, seed_x4: _, seed_x3: _, seed_x2: _, seed_x1: _, seed_x0: _,
      seed_y5: _, seed_y4: _, seed_y3: _, seed_y2: _, seed_y1: _, seed_y0: _,
      seed_z5: _, seed_z4: _, seed_z3: _, seed_z2: _, seed_z1: _, seed_z0: _
    });

    expect(result).toEqual({ out: _ });
  });
});

