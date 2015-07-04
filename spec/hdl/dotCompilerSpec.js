"use strict";

var describedClass = require("../../lib/hdl/dotCompiler");
var Parser = require("../../lib/hdl/parser");
var Environment = require("../../lib/hdl/environment");
var fs = require("fs");

describe("DotCompiler", function () {
  var nand, and, environment;

  beforeEach(function () {
    environment = new Environment();

    nand = Parser.parse("nand", "     \n\
      inputs a, b                     \n\
      outputs out                     \n\
                                      \n\
      | a | b | out |                 \n\
      | 0 | 0 |  1  |                 \n\
      | 0 | 1 |  1  |                 \n\
      | 1 | 0 |  1  |                 \n\
      | 1 | 1 |  0  |                 \n\
    ");

    and = Parser.parse("and", "       \n\
      inputs a, b                     \n\
      outputs out                     \n\
                                      \n\
      not(in=x, out=out)              \n\
      nand(a=a, b=b, out=x)           \n\
    ");

    environment.addChip("nand", nand);
    environment.addChip("and", and);
  });

  it("produces the expected dot output", function () {
    var path = [__dirname, "..", "fixtures", "expected.dot"].join("/");
    var expected = fs.readFileSync(path).toString();
    var actual = describedClass.compile(environment.graph);

    expect(actual).toEqual(expected);
  });
});
