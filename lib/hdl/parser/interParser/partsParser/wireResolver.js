"use strict";

var VariableResolver = require("../variableResolver");

module.exports.resolve = function (wire) {
  var otherProperties = VariableResolver.resolve(wire[0]);
  var thisProperties = VariableResolver.resolve(wire[1]);

  var properties = { name: otherProperties.name };

  if (typeof otherProperties.start !== "undefined") {
    properties.otherStart = otherProperties.start;
  }

  if (typeof otherProperties.end !== "undefined") {
    properties.otherEnd = otherProperties.end;
  }

  if (typeof thisProperties.start !== "undefined") {
    properties.thisStart = thisProperties.start;
  }

  if (typeof thisProperties.end !== "undefined") {
    properties.thisEnd = thisProperties.end;
  }

  return properties;
};
