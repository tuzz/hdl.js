"use strict";

module.exports.resolve = function (variable) {
  if (typeof variable === "string") {
    return { name: variable };
  }
  else if (variable === true) {
    return { name: "true" };
  }
  else if (variable === false) {
    return { name: "false" };
  }
  else if (typeof variable[1] === "number") {
    return { name: variable[0], width: variable[1] };
  }
  else {
    return { name: variable[0], start: variable[1][0], end: variable[1][1] };
  }
};
