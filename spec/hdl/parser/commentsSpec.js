"use strict";

var Parser = require("../../../lib/hdl/parser");

describe("comments", function () {
  var subject = new Parser();

  it("ignores comments", function () {
    var result = subject.parse("    \n\
      # comment                     \n\
      inputs in                     \n\
      outputs out # comment         \n\
                                    \n\
      # comment                     \n\
                                    \n\
      | in | out |                  \n\
      | 0  |  1  | # comment        \n\
      | 1  |  0  |                  \n\
    #comment");

    expect(result).toEqual({
      inputs: ["in"],
      outputs: ["out"],
      table: [
        [["in", false], ["out", true]],
        [["in", true], ["out", false]]
      ]
    });
  });
});
