"use strict";

var describedChip = "add_3";
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
    define("half_adder");
    define("adder");
    define("xor");
  });

  it("behaves as expected", function () {
    // 1 + 1 = 2
    var result = HDL.evaluate(describedChip, {
      a2: false, // 4 * 0
      a1: false, // 2 * 0
      a0: true,  // 1 * 1

      b2: false, // 4 * 0
      b1: false, // 2 * 0
      b0: true   // 1 * 1
    });
    expect(result).toEqual({
      o2: false, // 4 * 0
      o1: true,  // 2 * 1
      o0: false, // 1 * 0
      carry: false
    });

    // 1 + 3 = 4
    result = HDL.evaluate(describedChip, {
      a2: false, // 4 * 0
      a1: false, // 2 * 0
      a0: true,  // 1 * 1

      b2: false, // 4 * 0
      b1: true,  // 2 * 1
      b0: true   // 1 * 1
    });
    expect(result).toEqual({
      o2: true,  // 4 * 1
      o1: false, // 2 * 0
      o0: false, // 1 * 0
      carry: false
    });

    // 4 + 2 = 6
    result = HDL.evaluate(describedChip, {
      a2: true,  // 4 * 1
      a1: false, // 2 * 0
      a0: false, // 1 * 0

      b2: false, // 4 * 0
      b1: true,  // 2 * 1
      b0: false  // 1 * 0
    });
    expect(result).toEqual({
      o2: true,  // 4 * 1
      o1: true,  // 2 * 1
      o0: false, // 1 * 0
      carry: false
    });

    // 5 + 3 = 8 (carries)
    result = HDL.evaluate(describedChip, {
      a2: true,  // 4 * 1
      a1: false, // 2 * 0
      a0: true,  // 1 * 1

      b2: false, // 4 * 0
      b1: true,  // 2 * 1
      b0: true   // 1 * 1
    });
    expect(result).toEqual({
      o2: false, // 4 * 0
      o1: false, // 2 * 0
      o0: false, // 1 * 0
      carry: true
    });

    // 5 + 5 = 10 (carries)
    result = HDL.evaluate(describedChip, {
      a2: true,  // 4 * 1
      a1: false, // 2 * 0
      a0: true,  // 1 * 1

      b2: true,  // 4 * 1
      b1: false, // 2 * 0
      b0: true   // 1 * 1
    });
    expect(result).toEqual({
      o2: false, // 4 * 0
      o1: true,  // 2 * 1
      o0: false, // 1 * 0
      carry: true
    });
  });
});
