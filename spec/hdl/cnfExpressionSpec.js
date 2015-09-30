"use strict";

var CNFExpression = require("../../lib/hdl/cnfExpression");

describe("CNFExpression", function () {
  it("represents a CNF expression", function () {
    var expression = new CNFExpression();
    var conjunction = new CNFExpression.Conjunction();
    var disjunction = new CNFExpression.Disjunction();
    var literal = new CNFExpression.Literal("a");
    var negation = new CNFExpression.Negation("b");

    expression.conjunctions.push(conjunction);
    conjunction.disjunctions.push(disjunction);
    disjunction.terms.push(literal);
    disjunction.terms.push(negation);
  });
});
