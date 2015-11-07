"use strict";

var describedChip = "round_decimal";
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
    define("not");
    define("and");
    define("or");
    define("less_than_5");
    define("half_adder");
    define("xor");
    define("adder");
    define("add_6");
    define("equal_to_10");
    define("mux");
    define(describedChip);
  });

  it("behaves as expected", function () {
    var _ = false;
    var T = true;

    // 0.00 -> 0.0
    var result = HDL.evaluate(describedChip, {
      sf1_in5: _, sf1_in4: _, sf1_in3: _,
      sf1_in2: _, sf1_in1: _, sf1_in0: _,

      sf2_in3: _, sf2_in2: _, sf2_in1: _, sf2_in0: _,
      sf3_in3: _, sf3_in2: _, sf3_in1: _, sf3_in0: _
    });
    expect(result).toEqual({
      sf1_out5: _, sf1_out4: _, sf1_out3: _,
      sf1_out2: _, sf1_out1: _, sf1_out0: _,

      sf2_out3: _, sf2_out2: _, sf2_out1: _, sf2_out0: _
    });

    // 0.04 -> 0.0
    result = HDL.evaluate(describedChip, {
      sf1_in5: _, sf1_in4: _, sf1_in3: _,
      sf1_in2: _, sf1_in1: _, sf1_in0: _,

      sf2_in3: _, sf2_in2: _, sf2_in1: _, sf2_in0: _,
      sf3_in3: _, sf3_in2: T, sf3_in1: _, sf3_in0: _
    });
    expect(result).toEqual({
      sf1_out5: _, sf1_out4: _, sf1_out3: _,
      sf1_out2: _, sf1_out1: _, sf1_out0: _,

      sf2_out3: _, sf2_out2: _, sf2_out1: _, sf2_out0: _
    });

    // 0.05 -> 0.1
    result = HDL.evaluate(describedChip, {
      sf1_in5: _, sf1_in4: _, sf1_in3: _,
      sf1_in2: _, sf1_in1: _, sf1_in0: _,

      sf2_in3: _, sf2_in2: _, sf2_in1: _, sf2_in0: _,
      sf3_in3: _, sf3_in2: T, sf3_in1: _, sf3_in0: T,
    });
    expect(result).toEqual({
      sf1_out5: _, sf1_out4: _, sf1_out3: _,
      sf1_out2: _, sf1_out1: _, sf1_out0: _,

      sf2_out3: _, sf2_out2: _, sf2_out1: _, sf2_out0: T
    });

    // 0.09 -> 0.1
    result = HDL.evaluate(describedChip, {
      sf1_in5: _, sf1_in4: _, sf1_in3: _,
      sf1_in2: _, sf1_in1: _, sf1_in0: _,

      sf2_in3: _, sf2_in2: _, sf2_in1: _, sf2_in0: _,
      sf3_in3: T, sf3_in2: _, sf3_in1: _, sf3_in0: T
    });
    expect(result).toEqual({
      sf1_out5: _, sf1_out4: _, sf1_out3: _,
      sf1_out2: _, sf1_out1: _, sf1_out0: _,

      sf2_out3: _, sf2_out2: _, sf2_out1: _, sf2_out0: T,
    });

    // 1.59 -> 1.6
    result = HDL.evaluate(describedChip, {
      sf1_in5: _, sf1_in4: _, sf1_in3: _,
      sf1_in2: _, sf1_in1: _, sf1_in0: T,

      sf2_in3: _, sf2_in2: T, sf2_in1: _, sf2_in0: T,
      sf3_in3: T, sf3_in2: _, sf3_in1: _, sf3_in0: T
    });
    expect(result).toEqual({
      sf1_out5: _, sf1_out4: _, sf1_out3: _,
      sf1_out2: _, sf1_out1: _, sf1_out0: T,

      sf2_out3: _, sf2_out2: T, sf2_out1: T, sf2_out0: _,
    });

    // 1.99 -> 2.0
    result = HDL.evaluate(describedChip, {
      sf1_in5: _, sf1_in4: _, sf1_in3: _,
      sf1_in2: _, sf1_in1: _, sf1_in0: T,

      sf2_in3: T, sf2_in2: _, sf2_in1: _, sf2_in0: T,
      sf3_in3: T, sf3_in2: _, sf3_in1: _, sf3_in0: T
    });
    expect(result).toEqual({
      sf1_out5: _, sf1_out4: _, sf1_out3: _,
      sf1_out2: _, sf1_out1: T, sf1_out0: _,

      sf2_out3: _, sf2_out2: _, sf2_out1: _, sf2_out0: _
    });

    // 2.89 -> 2.9
    result = HDL.evaluate(describedChip, {
      sf1_in5: _, sf1_in4: _, sf1_in3: _,
      sf1_in2: _, sf1_in1: T, sf1_in0: _,

      sf2_in3: T, sf2_in2: _, sf2_in1: _, sf2_in0: _,
      sf3_in3: T, sf3_in2: _, sf3_in1: _, sf3_in0: T
    });
    expect(result).toEqual({
      sf1_out5: _, sf1_out4: _, sf1_out3: _,
      sf1_out2: _, sf1_out1: T, sf1_out0: _,

      sf2_out3: T, sf2_out2: _, sf2_out1: _, sf2_out0: T,
    });

    // 2.99 -> 3.0
    result = HDL.evaluate(describedChip, {
      sf1_in5: _, sf1_in4: _, sf1_in3: _,
      sf1_in2: _, sf1_in1: T, sf1_in0: _,

      sf2_in3: T, sf2_in2: _, sf2_in1: _, sf2_in0: T,
      sf3_in3: T, sf3_in2: _, sf3_in1: _, sf3_in0: T,
    });
    expect(result).toEqual({
      sf1_out5: _, sf1_out4: _, sf1_out3: _,
      sf1_out2: _, sf1_out1: T, sf1_out0: T,

      sf2_out3: _, sf2_out2: _, sf2_out1: _, sf2_out0: _,
    });

    // 63.94 -> 63.9
    result = HDL.evaluate(describedChip, {
      sf1_in5: T, sf1_in4: T, sf1_in3: T,
      sf1_in2: T, sf1_in1: T, sf1_in0: T,

      sf2_in3: T, sf2_in2: _, sf2_in1: _, sf2_in0: T,
      sf3_in3: _, sf3_in2: T, sf3_in1: _, sf3_in0: _
    });
    expect(result).toEqual({
      sf1_out5: T, sf1_out4: T, sf1_out3: T,
      sf1_out2: T, sf1_out1: T, sf1_out0: T,

      sf2_out3: T, sf2_out2: _, sf2_out1: _, sf2_out0: T
    });

    // 63.95 -> 0.0 (overflows)
    result = HDL.evaluate(describedChip, {
      sf1_in5: T, sf1_in4: T, sf1_in3: T,
      sf1_in2: T, sf1_in1: T, sf1_in0: T,

      sf2_in3: T, sf2_in2: _, sf2_in1: _, sf2_in0: T,
      sf3_in3: _, sf3_in2: T, sf3_in1: _, sf3_in0: T,
    });
    expect(result).toEqual({
      sf1_out5: _, sf1_out4: _, sf1_out3: _,
      sf1_out2: _, sf1_out1: _, sf1_out0: _,

      sf2_out3: _, sf2_out2: _, sf2_out1: _, sf2_out0: _,
    });
  });
});

