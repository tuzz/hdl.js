"use strict";

var describedChip = "s_lookup";
var HDL = require("../../lib/hdl");
var fs = require("fs");

describe(describedChip, function () {
  beforeEach(function () {
    var root = [__dirname, "..", ".."].join("/");
    var path = [root, "chips", describedChip + ".hdl"].join("/");
    var hdl = fs.readFileSync(path).toString();

    HDL.reset();
    HDL.define(describedChip, hdl);
  });

  it("behaves as expected", function () {
    var result = HDL.evaluate(describedChip, {
      i5: false, // 32 * 0
      i4: false, // 16 * 0
      i3: false, // 08 * 0
      i2: true,  // 04 * 1
      i1: false, // 02 * 0
      i0: true   // 01 * 1
    });
    // The term "five s's" contains 2 's'
    expect(result).toEqual({ o2: false, o1: true, o0: false });

    result = HDL.evaluate(describedChip, {
      i5: false, // 32 * 0
      i4: false, // 16 * 0
      i3: false, // 08 * 0
      i2: false, // 04 * 0
      i1: false, // 02 * 0
      i0: true   // 01 * 1
    });
    // The term "one s" contains 1 's'
    expect(result).toEqual({ o2: false, o1: false, o0: true });

    result = HDL.evaluate(describedChip, {
      i5: false, // 32 * 0
      i4: true,  // 16 * 1
      i3: false, // 08 * 0
      i2: false, // 04 * 0
      i1: false, // 02 * 0
      i0: true   // 01 * 1
    });
    // The term "seventeen s's" contains s 's'
    expect(result).toEqual({ o2: false, o1: true, o0: true });
  });
});
