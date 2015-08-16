var Application = function (
    containerId,
    textareaId,
    errorLineId,
    chipNameId,
    removeId,
    evaluateNameId,
    evaluateExpressionId,
    evaluateId,
    evaluateResultId
) {
  var self = this;

  var container = document.getElementById(containerId);
  var textarea = document.getElementById(textareaId);
  var errorLine = document.getElementById(errorLineId);
  var chipName = document.getElementById(chipNameId);
  var remove = document.getElementById(removeId);
  var evaluateName = document.getElementById(evaluateNameId);
  var evaluateExpression = document.getElementById(evaluateExpressionId);
  var evaluate = document.getElementById(evaluateId);
  var evaluateResult = document.getElementById(evaluateResultId);

  var update = function () {
    parse();
    render();
  };

  var parse = function () {
    catchError(function () {
      HDL.define(chipName.value, textarea.value);
    });
  }

  var render = function () {
    var dot = HDL.toDot();
    var svg = Viz(dot, "svg");

    container.innerHTML = svg;
  };

  var timer;
  var delayed = function (callback) {
    return function () {
      clearTimeout(timer);
      timer = setTimeout(callback, 1000);
    }
  };

  var removeChip = function () {
    HDL.undefine(chipName.value);
    render();
  };

  var eval = function () {
    catchError(function () {
      var expression = JSON.parse(evaluateExpression.value);
      var name = evaluateName.value;
      var result = HDL.evaluate(name, expression);

      evaluateResult.innerHTML = JSON.stringify(result);
    });
  };

  var catchError = function (callback) {
    try {
      errorLine.innerHTML = "";
      callback();
    }
    catch (error) {
      errorLine.innerHTML = error.message;
    }
  };

  textarea.onkeyup = delayed(update);
  textarea.onfocus = update;
  remove.onclick = removeChip;
  evaluate.onclick = eval;
  update();
}
