"use strict";

var env = "../../../../../lib/hdl/environment";
var CNFExpression = require(env + "/tseitinTransformer/cnfExpression");

describe("CNFExpression", function () {
  it("represents a CNF expression", function () {
    var expression = new CNFExpression();
    var conjunction = new CNFExpression.Conjunction();
    var disjunction = new CNFExpression.Disjunction();

    disjunction.value = "a";
    disjunction.isNegative = false;
    conjunction.disjunctions.push(disjunction);
    expression.conjunctions.push(conjunction);
  });
});
