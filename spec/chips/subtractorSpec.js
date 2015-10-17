"use strict";

var describedChip = "subtractor";
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
    define("half_subtractor");
    define("or");
  });

  it("behaves as expected", function () {
    var _ = false;
    var T = true;


    var result = HDL.evaluate(describedChip, { a: _, b: _, b_in: _ });
    expect(result).toEqual({ difference: _, b_out: _ });

    result = HDL.evaluate(describedChip, { a: T, b: _, b_in: _ });
    expect(result).toEqual({ difference: T, b_out: _ });

    result = HDL.evaluate(describedChip, { a: T, b: _, b_in: T });
    expect(result).toEqual({ difference: _, b_out: _ });

    result = HDL.evaluate(describedChip, { a: _, b: _, b_in: T });
    expect(result).toEqual({ difference: T, b_out: T });

    result = HDL.evaluate(describedChip, { a: T, b: T, b_in: T });
    expect(result).toEqual({ difference: T, b_out: T });

    result = HDL.evaluate(describedChip, { a: _, b: T, b_in: T });
    expect(result).toEqual({ difference: _, b_out: T });
  });
});
