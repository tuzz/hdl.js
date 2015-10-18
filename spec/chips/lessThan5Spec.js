"use strict";

var describedChip = "less_than_5";
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
    define("not");
    define("or");
    define(describedChip);
  });

  it("behaves as expected", function () {
    var _ = false;
    var T = true;

    var result = HDL.evaluate(describedChip, {
      i5: _, i4: _, i3: _, i2: _, i1: _, i0: _
    });
    expect(result).toEqual({ out: T });

    result = HDL.evaluate(describedChip, {
      i5: _, i4: _, i3: _, i2: _, i1: _, i0: T
    });
    expect(result).toEqual({ out: T });

    result = HDL.evaluate(describedChip, {
      i5: _, i4: _, i3: _, i2: _, i1: T, i0: _
    });
    expect(result).toEqual({ out: T });

    result = HDL.evaluate(describedChip, {
      i5: _, i4: _, i3: _, i2: _, i1: T, i0: T
    });
    expect(result).toEqual({ out: T });

    result = HDL.evaluate(describedChip, {
      i5: _, i4: _, i3: _, i2: T, i1: _, i0: _
    });
    expect(result).toEqual({ out: T });

    result = HDL.evaluate(describedChip, {
      i5: _, i4: _, i3: _, i2: T, i1: _, i0: T
    });
    expect(result).toEqual({ out: _ });

    result = HDL.evaluate(describedChip, {
      i5: _, i4: _, i3: _, i2: T, i1: T, i0: _
    });
    expect(result).toEqual({ out: _ });

    result = HDL.evaluate(describedChip, {
      i5: _, i4: _, i3: _, i2: T, i1: T, i0: T
    });
    expect(result).toEqual({ out: _ });

    result = HDL.evaluate(describedChip, {
      i5: T, i4: _, i3: _, i2: _, i1: _, i0: _
    });
    expect(result).toEqual({ out: _ });

    result = HDL.evaluate(describedChip, {
      i5: _, i4: T, i3: _, i2: _, i1: _, i0: _
    });
    expect(result).toEqual({ out: _ });
  });
});
