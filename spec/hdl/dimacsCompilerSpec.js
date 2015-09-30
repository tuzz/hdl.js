"use strict";

var env = "../../lib/hdl/environment";
var CNFExpression = require(env + "/tseitinTransformer/cnfExpression");
var describedClass = require("../../lib/hdl/dimacsCompiler");

describe("DimacsCompiler", function () {
  it("produces the correct DIMACS format string", function () {
    var expression = new CNFExpression();

    var c1 = new CNFExpression.Conjunction();
    var c2 = new CNFExpression.Conjunction();
    var c3 = new CNFExpression.Conjunction();

    var c1d1 = new CNFExpression.Disjunction();
    var c1d2 = new CNFExpression.Disjunction();
    var c1d3 = new CNFExpression.Disjunction();

    var c2d1 = new CNFExpression.Disjunction();
    var c2d2 = new CNFExpression.Disjunction();

    var c3d1 = new CNFExpression.Disjunction();

    expression.conjunctions = [c1, c2, c3];

    c1.disjunctions = [c1d1, c1d2, c1d3];
    c2.disjunctions = [c2d1, c2d2];
    c3.disjunctions = [c3d1];

    c1d1.value = "a";
    c1d2.value = "b";
    c1d3.value = "out";

    c1d1.isNegation = true;
    c1d2.isNegation = true;
    c1d3.isNegation = false;

    c2d1.value = "true";
    c2d2.value = "a";

    c2d1.isNegation = false;
    c2d2.isNegation = true;

    c3d1.value = "b";
    c3d1.isNegation = false;

    var result = describedClass.compile(expression);
    expect(result).toBeDefined();

    /* jshint ignore:start */

    expect(result).toEqual("p cnf 4 3\n\
-1 -2 3 0\n\
4 -1 0\n\
2 0\n\
\n\
c Variable mappings:\n\
c 1 -> a\n\
c 2 -> b\n\
c 3 -> out\n\
c 4 -> true\n\
");

    /* jshint ignore:end */
  });

});
