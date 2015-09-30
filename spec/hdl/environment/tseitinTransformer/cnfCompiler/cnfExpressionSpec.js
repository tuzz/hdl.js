"use strict";

var tseitin = "../../../../../lib/hdl/environment/tseitinTransformer";
var CNFExpression = require(tseitin + "/cnfExpression");

describe("CNFExpression", function () {
  it("represents a CNF expression", function () {
    var expression = new CNFExpression();
    var conjunction = new CNFExpression.Conjunction();
    var disjunction = new CNFExpression.Disjunction();

    disjunction.value = "a";
    disjunction.isNegation = false;
    conjunction.disjunctions.push(disjunction);
    expression.conjunctions.push(conjunction);
  });

  it("prints out to a human-readable form", function () {
    var expression = new CNFExpression();
    var conjunction = new CNFExpression.Conjunction();
    var disjunction = new CNFExpression.Disjunction();

    disjunction.value = "a";
    disjunction.isNegation = false;
    conjunction.disjunctions.push(disjunction);

    disjunction = new CNFExpression.Disjunction();
    disjunction.value = "b";
    disjunction.isNegation = true;
    conjunction.disjunctions.push(disjunction);

    expression.conjunctions.push(conjunction);
    conjunction = new CNFExpression.Conjunction();

    disjunction = new CNFExpression.Disjunction();
    disjunction.value = "x";
    disjunction.isNegation = false;
    conjunction.disjunctions.push(disjunction);

    expression.conjunctions.push(conjunction);

    expect(expression.toString()).toEqual("(a || !b) && x");
  });
});
