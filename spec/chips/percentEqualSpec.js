"use strict";

var describedChip = "percent_equal";
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
    define("xnor");
    define(describedChip);
  });

  it("behaves as expected", function () {
    var _ = false;
    var T = true;

    var result = HDL.evaluate(describedChip, {
      a_sf1_0: _, a_sf1_1: T, a_sf1_2: _, a_sf1_3: T, a_sf1_4: _, a_sf1_5: T,
      a_sf2_0: T, a_sf2_1: _, a_sf2_2: T, a_sf2_3: _,
      a_sf3_0: _, a_sf3_1: T, a_sf3_2: _, a_sf3_3: T,

      b_sf1_0: _, b_sf1_1: T, b_sf1_2: _, b_sf1_3: T, b_sf1_4: _, b_sf1_5: T,
      b_sf2_0: T, b_sf2_1: _, b_sf2_2: T, b_sf2_3: _
    });

    expect(result).toEqual({ out: T });

    result = HDL.evaluate(describedChip, {
      a_sf1_0: _, a_sf1_1: T, a_sf1_2: _, a_sf1_3: T, a_sf1_4: _, a_sf1_5: T,
      a_sf2_0: T, a_sf2_1: _, a_sf2_2: T, a_sf2_3: _,
      a_sf3_0: _, a_sf3_1: T, a_sf3_2: _, a_sf3_3: _,

      b_sf1_0: _, b_sf1_1: T, b_sf1_2: _, b_sf1_3: T, b_sf1_4: _, b_sf1_5: T,
      b_sf2_0: T, b_sf2_1: _, b_sf2_2: T, b_sf2_3: T
    });

    expect(result).toEqual({ out: _ });
  });
});

