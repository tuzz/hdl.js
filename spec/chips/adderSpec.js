"use strict";

var describedChip = "adder";
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
    define("xor");
  });

  it("behaves as expected", function () {
    var result = HDL.evaluate(describedChip, { a: false, b: false, c: false });
    expect(result).toEqual({ sum: false, carry: false });

    result = HDL.evaluate(describedChip, { a: false, b: false, c: true });
    expect(result).toEqual({ sum: true, carry: false });

    result = HDL.evaluate(describedChip, { a: false, b: true, c: false });
    expect(result).toEqual({ sum: true, carry: false });

    result = HDL.evaluate(describedChip, { a: false, b: true, c: true });
    expect(result).toEqual({ sum: false, carry: true });

    result = HDL.evaluate(describedChip, { a: true, b: false, c: false });
    expect(result).toEqual({ sum: true, carry: false });

    result = HDL.evaluate(describedChip, { a: true, b: false, c: true });
    expect(result).toEqual({ sum: false, carry: true });

    result = HDL.evaluate(describedChip, { a: true, b: true, c: false });
    expect(result).toEqual({ sum: false, carry: true });

    result = HDL.evaluate(describedChip, { a: true, b: true, c: true });
    expect(result).toEqual({ sum: true, carry: true });
  });
});
