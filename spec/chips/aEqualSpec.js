"use strict";

var describedChip = "a_equal";
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
    define("and");
    define("xor");
    define("not");
    define("is_zero");
    define("a_lookup");
    define("mux");
    define("half_adder");
    define("adder");
    define("add_6");
    define("add_12");
    define("lookup_adder");
    define("a_number");
    define("a_sum");
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
    define(describedChip);
  });

  it("behaves as expected", function () {
    var _ = false;
    var T = true;

    var result = HDL.evaluate(describedChip, {
      a_sf1_5: _, a_sf1_4: _, a_sf1_3: T, a_sf1_2: _, a_sf1_1: T, a_sf1_0: _, // ten           = 0
                                                                              // ____          = 0
      a_sf2_3: _, a_sf2_2: _, a_sf2_1: _, a_sf2_0: _,                         // ____          = 0
      a_sf3_3: _, a_sf3_2: _, a_sf3_1: _, a_sf3_0: _,                         // ____          = 0
                                                                              // percent       = 0
                                                                              // are a's       = 2

      b_sf1_5: _, b_sf1_4: _, b_sf1_3: _, b_sf1_2: _, b_sf1_1: T, b_sf1_0: _, // two           = 0
                                                                              // point         = 0
      b_sf2_3: _, b_sf2_2: T, b_sf2_1: T, b_sf2_0: T,                         // seven         = 0
      b_sf3_3: _, b_sf3_2: T, b_sf3_1: T, b_sf3_0: _,                         // six           = 0
                                                                              // percent       = 0
                                                                              // are b's       = 1

      c_sf1_5: _, c_sf1_4: _, c_sf1_3: _, c_sf1_2: _, c_sf1_1: T, c_sf1_0: T, // three         = 0
                                                                              // point         = 0
      c_sf2_3: _, c_sf2_2: T, c_sf2_1: _, c_sf2_0: T,                         // five          = 0
      c_sf3_3: _, c_sf3_2: T, c_sf3_1: _, c_sf3_0: _,                         // four          = 0
                                                                              // percent       = 0
                                                                              // are c's       = 1

      d_sf1_5: _, d_sf1_4: _, d_sf1_3: _, d_sf1_2: T, d_sf1_1: _, d_sf1_0: _, // four          = 0
                                                                              // point         = 0
      d_sf2_3: _, d_sf2_2: _, d_sf2_1: T, d_sf2_0: T,                         // three         = 0
      d_sf3_3: _, d_sf3_2: _, d_sf3_1: T, d_sf3_0: _,                         // two           = 0
                                                                              // percent       = 0
                                                                              // are d's       = 1

      e_sf1_5: _, e_sf1_4: _, e_sf1_3: _, e_sf1_2: T, e_sf1_1: _, e_sf1_0: T, // five          = 0
                                                                              // point         = 0
      e_sf2_3: _, e_sf2_2: _, e_sf2_1: _, e_sf2_0: T,                         // one           = 0
      e_sf3_3: _, e_sf3_2: _, e_sf3_1: _, e_sf3_0: _,                         // ____          = 0
                                                                              // percent       = 0
                                                                              // are e's       = 1

      f_sf1_5: _, f_sf1_4: _, f_sf1_3: _, f_sf1_2: T, f_sf1_1: T, f_sf1_0: _, // six           = 0
                                                                              // point         = 0
      f_sf2_3: T, f_sf2_2: _, f_sf2_1: _, f_sf2_0: T,                         // nine          = 0
      f_sf3_3: T, f_sf3_2: _, f_sf3_1: _, f_sf3_0: _,                         // eight         = 0
                                                                              // percent       = 0
                                                                              // are f's       = 1

      g_sf1_5: _, g_sf1_4: _, g_sf1_3: _, g_sf1_2: T, g_sf1_1: T, g_sf1_0: T, // seven         = 0
                                                                              // point         = 0
      g_sf2_3: _, g_sf2_2: T, g_sf2_1: T, g_sf2_0: T,                         // seven         = 0
      g_sf3_3: _, g_sf3_2: T, g_sf3_1: T, g_sf3_0: _,                         // six           = 0
                                                                              // percent       = 0
                                                                              // are g's       = 1

      h_sf1_5: _, h_sf1_4: _, h_sf1_3: T, h_sf1_2: _, h_sf1_1: _, h_sf1_0: _, // eight         = 0
                                                                              // point         = 0
      h_sf2_3: _, h_sf2_2: T, h_sf2_1: _, h_sf2_0: T,                         // five          = 0
      h_sf3_3: _, h_sf3_2: T, h_sf3_1: _, h_sf3_0: _,                         // four          = 0
                                                                              // percent       = 0
                                                                              // are h's       = 1

      i_sf1_5: _, i_sf1_4: _, i_sf1_3: T, i_sf1_2: _, i_sf1_1: _, i_sf1_0: T, // nine          = 0
                                                                              // point         = 0
      i_sf2_3: _, i_sf2_2: _, i_sf2_1: T, i_sf2_0: T,                         // three         = 0
      i_sf3_3: _, i_sf3_2: _, i_sf3_1: T, i_sf3_0: _,                         // two           = 0
                                                                              // percent       = 0
                                                                              // are i's       = 1

      j_sf1_5: _, j_sf1_4: _, j_sf1_3: T, j_sf1_2: _, j_sf1_1: T, j_sf1_0: _, // ten           = 0
                                                                              // point         = 0
      j_sf2_3: _, j_sf2_2: _, j_sf2_1: _, j_sf2_0: T,                         // one           = 0
      j_sf3_3: _, j_sf3_2: _, j_sf3_1: _, j_sf3_0: _,                         // ____          = 0
                                                                              // percent       = 0
                                                                              // are j's       = 1

      k_sf1_5: _, k_sf1_4: _, k_sf1_3: T, k_sf1_2: _, k_sf1_1: T, k_sf1_0: T, // eleven        = 0
                                                                              // point         = 0
      k_sf2_3: T, k_sf2_2: _, k_sf2_1: _, k_sf2_0: T,                         // nine          = 0
      k_sf3_3: T, k_sf3_2: _, k_sf3_1: _, k_sf3_0: _,                         // eight         = 0
                                                                              // percent       = 0
                                                                              // are k's       = 1

      l_sf1_5: _, l_sf1_4: _, l_sf1_3: T, l_sf1_2: T, l_sf1_1: _, l_sf1_0: _, // twelve        = 0
                                                                              // point         = 0
      l_sf2_3: _, l_sf2_2: T, l_sf2_1: T, l_sf2_0: T,                         // seven         = 0
      l_sf3_3: _, l_sf3_2: T, l_sf3_1: T, l_sf3_0: _,                         // six           = 0
                                                                              // percent       = 0
                                                                              // are l's       = 1

      m_sf1_5: _, m_sf1_4: _, m_sf1_3: T, m_sf1_2: T, m_sf1_1: _, m_sf1_0: T, // thirteen      = 0
                                                                              // ____          = 0
      m_sf2_3: _, m_sf2_2: _, m_sf2_1: _, m_sf2_0: _,                         // ____          = 0
      m_sf3_3: _, m_sf3_2: _, m_sf3_1: _, m_sf3_0: _,                         // ____          = 0
                                                                              // percent       = 0
                                                                              // are m's       = 1

      n_sf1_5: _, n_sf1_4: _, n_sf1_3: T, n_sf1_2: T, n_sf1_1: T, n_sf1_0: _, // fourteen      = 0
                                                                              // point         = 0
      n_sf2_3: _, n_sf2_2: _, n_sf2_1: T, n_sf2_0: T,                         // three         = 0
      n_sf3_3: _, n_sf3_2: _, n_sf3_1: T, n_sf3_0: _,                         // two           = 0
                                                                              // percent       = 0
                                                                              // are n's       = 1

      o_sf1_5: _, o_sf1_4: _, o_sf1_3: T, o_sf1_2: T, o_sf1_1: T, o_sf1_0: T, // fifteen       = 0
                                                                              // point         = 0
      o_sf2_3: _, o_sf2_2: _, o_sf2_1: _, o_sf2_0: T,                         // one           = 0
      o_sf3_3: _, o_sf3_2: _, o_sf3_1: _, o_sf3_0: _,                         // ____          = 0
                                                                              // percent       = 0
                                                                              // are o's       = 1

      p_sf1_5: _, p_sf1_4: T, p_sf1_3: _, p_sf1_2: _, p_sf1_1: _, p_sf1_0: _, // sixteen       = 0
                                                                              // point         = 0
      p_sf2_3: _, p_sf2_2: _, p_sf2_1: _, p_sf2_0: _,                         // zero          = 0
      p_sf3_3: _, p_sf3_2: T, p_sf3_1: _, p_sf3_0: T,                         // five          = 0
                                                                              // percent       = 0
                                                                              // are p's       = 1

      q_sf1_5: _, q_sf1_4: T, q_sf1_3: _, q_sf1_2: _, q_sf1_1: _, q_sf1_0: T, // seventeen     = 0
                                                                              // point         = 0
      q_sf2_3: _, q_sf2_2: T, q_sf2_1: T, q_sf2_0: T,                         // seven         = 0
      q_sf3_3: _, q_sf3_2: T, q_sf3_1: T, q_sf3_0: _,                         // six           = 0
                                                                              // percent       = 0
                                                                              // are q's       = 1

      r_sf1_5: _, r_sf1_4: T, r_sf1_3: _, r_sf1_2: _, r_sf1_1: T, r_sf1_0: _, // eighteen      = 0
                                                                              // point         = 0
      r_sf2_3: _, r_sf2_2: T, r_sf2_1: _, r_sf2_0: T,                         // five          = 0
      r_sf3_3: _, r_sf3_2: T, r_sf3_1: _, r_sf3_0: _,                         // four          = 0
                                                                              // percent       = 0
                                                                              // are r's       = 1

      s_sf1_5: _, s_sf1_4: T, s_sf1_3: _, s_sf1_2: _, s_sf1_1: T, s_sf1_0: T, // nineteen      = 0
                                                                              // point         = 0
      s_sf2_3: _, s_sf2_2: _, s_sf2_1: T, s_sf2_0: T,                         // three         = 0
      s_sf3_3: _, s_sf3_2: _, s_sf3_1: T, s_sf3_0: _,                         // two           = 0
                                                                              // percent       = 0
                                                                              // are s's       = 1

      t_sf1_5: _, t_sf1_4: T, t_sf1_3: _, t_sf1_2: T, t_sf1_1: _, t_sf1_0: _, // twenty        = 0
                                                                              // point         = 0
      t_sf2_3: _, t_sf2_2: _, t_sf2_1: _, t_sf2_0: T,                         // one           = 0
      t_sf3_3: _, t_sf3_2: _, t_sf3_1: _, t_sf3_0: _,                         // ____          = 0
                                                                              // percent       = 0
                                                                              // are t's       = 1

      u_sf1_5: _, u_sf1_4: T, u_sf1_3: _, u_sf1_2: T, u_sf1_1: _, u_sf1_0: T, // twenty-one    = 0
                                                                              // point         = 0
      u_sf2_3: T, u_sf2_2: _, u_sf2_1: _, u_sf2_0: T,                         // nine          = 0
      u_sf3_3: T, u_sf3_2: _, u_sf3_1: _, u_sf3_0: _,                         // eight         = 0
                                                                              // percent       = 0
                                                                              // are u's       = 1

      v_sf1_5: _, v_sf1_4: T, v_sf1_3: _, v_sf1_2: T, v_sf1_1: T, v_sf1_0: _, // twenty-two    = 0
                                                                              // point         = 0
      v_sf2_3: _, v_sf2_2: T, v_sf2_1: T, v_sf2_0: T,                         // seven         = 0
      v_sf3_3: _, v_sf3_2: T, v_sf3_1: T, v_sf3_0: _,                         // six           = 0
                                                                              // percent       = 0
                                                                              // are v's       = 1

      w_sf1_5: _, w_sf1_4: T, w_sf1_3: _, w_sf1_2: T, w_sf1_1: T, w_sf1_0: T, // twenty-three  = 0
                                                                              // ____          = 0
      w_sf2_3: _, w_sf2_2: _, w_sf2_1: _, w_sf2_0: _,                         // ____          = 0
      w_sf3_3: _, w_sf3_2: _, w_sf3_1: _, w_sf3_0: _,                         // ____          = 0
                                                                              // percent       = 0
                                                                              // are w's       = 1

      x_sf1_5: _, x_sf1_4: T, x_sf1_3: T, x_sf1_2: _, x_sf1_1: _, x_sf1_0: _, // twenty-four   = 0
                                                                              // point         = 0
      x_sf2_3: _, x_sf2_2: _, x_sf2_1: T, x_sf2_0: T,                         // three         = 0
      x_sf3_3: _, x_sf3_2: _, x_sf3_1: T, x_sf3_0: _,                         // two           = 0
                                                                              // percent       = 0
                                                                              // are x's       = 1

      y_sf1_5: _, y_sf1_4: T, y_sf1_3: T, y_sf1_2: _, y_sf1_1: _, y_sf1_0: T, // twenty-five   = 0
                                                                              // point         = 0
      y_sf2_3: _, y_sf2_2: _, y_sf2_1: _, y_sf2_0: T,                         // one           = 0
      y_sf3_3: _, y_sf3_2: _, y_sf3_1: _, y_sf3_0: _,                         // ____          = 0
                                                                              // percent       = 0
                                                                              // are y's       = 1

      z_sf1_5: _, z_sf1_4: T, z_sf1_3: T, z_sf1_2: _, z_sf1_1: T, z_sf1_0: _, // twenty-six    = 0
                                                                              // point         = 0
      z_sf2_3: T, z_sf2_2: _, z_sf2_1: _, z_sf2_0: T,                         // nine          = 0
      z_sf3_3: T, z_sf3_2: _, z_sf3_1: _, z_sf3_0: _,                         // eight         = 0
                                                                              // percent       = 0
                                                                              // are z's       = 1

      seed5: T, seed4: T, seed3: T, seed2: T, seed1: T, seed0: T,             // << seed >>    = 63

                                                                              // Total: 90
      // 900 * 10% = 90
      total11: _, total10: _, total9: T, total8: T, total7: T, total6: _,
      total5: _, total4: _, total3: _, total2: T, total1: _, total0: _
    });

    expect(result).toEqual({ out: T });
  });
});

