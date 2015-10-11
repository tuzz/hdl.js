"use strict";

var describedChip = "equal_6";
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
    define("and");
    define("xnor");
  });

  it("behaves as expected", function () {
    var _ = false;
    var T = true;

    var result = HDL.evaluate(describedChip, {
      a5: _, a4: _, a3: _, a2: _, a1: _, a0: _,
      b5: _, b4: _, b3: _, b2: _, b1: _, b0: _,
    });

    expect(result).toEqual({ out: true });

//    result = HDL.evaluate(describedChip, {
//      a5: T, a4: T, a3: T, a2: T, a1: T, a0: T,
//      b5: T, b4: T, b3: T, b2: T, b1: T, b0: T,
//    });
//
//    expect(result).toEqual({ out: true });
//
//    result = HDL.evaluate(describedChip, {
//      a5: _, a4: T, a3: _, a2: T, a1: _, a0: T,
//      b5: _, b4: T, b3: _, b2: T, b1: _, b0: T,
//    });
//
//    expect(result).toEqual({ out: true });
//
//    result = HDL.evaluate(describedChip, {
//      a5: T, a4: _, a3: _, a2: T, a1: _, a0: T,
//      b5: _, b4: T, b3: _, b2: T, b1: _, b0: T,
//    });
//
//    expect(result).toEqual({ out: false });
//
//    result = HDL.evaluate(describedChip, {
//      a5: _, a4: _, a3: _, a2: _, a1: T, a0: T,
//      b5: _, b4: _, b3: _, b2: T, b1: _, b0: _,
//    });
//
//    expect(result).toEqual({ out: false });
  });
});
