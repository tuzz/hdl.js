definition
  = whitespace? pins:pins whitespace? body:(table / parts) whitespace? {
    var object = {
      inputs: pins.inputs,
      outputs: pins.outputs
    }

    if (body.table) {
      object.table = body.table;
    }
    else {
      object.parts = body.parts;
    }

    return object;
  }

pins
  = inputs:inputs whitespace outputs:outputs {
    return { inputs: inputs, outputs: outputs };
  }

inputs
  = "inputs" whitespace interface_variables:interface_variables {
    return interface_variables;
  }

outputs
  = "outputs" whitespace interface_variables:interface_variables {
    return interface_variables;
  }

parts
  = head:part tail:other_parts* {
    return {parts: [head].concat(tail) };
  }

other_parts
  = whitespace? part:part {
    return part;
  }

part
  = part_name:part_name "(" whitespace? assignments:assignments whitespace? ")" {
    return [part_name, assignments];
  }

part_name
  = variable / "_clocked"

assignments
  = head:assignment tail:other_assignments* {
    return [head].concat(tail);
  }

other_assignments
  = whitespace? "," whitespace? assignment:assignment {
    return assignment;
  }

assignment
  = left:part_variable whitespace? "=" whitespace? right:right_assignment {
    return [left, right];
  }

right_assignment
  = part_variable / boolean_bus / boolean

table
  = header:header rows:row+ {
    var data = [];

    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var array = [];

      for (var j = 0; j < header.length; j++) {
        var pin = header[j];
        var bool = row[j];

        array.push([pin, bool]);
      }

      data.push(array);
    }

    return { table: data };
  }

header
  = "|" whitespace? header_variables:header_variables whitespace? "|" {
    return header_variables;
  }

header_variables
  = head:variable tail:other_header_variables* {
    return [head].concat(tail);
  }

other_header_variables
  = whitespace? "|" whitespace? variable:variable {
    return variable;
  }

row
  = whitespace? "|" whitespace? row_booleans:row_booleans whitespace? "|" {
    return row_booleans;
  }

row_booleans
  = head:boolean tail:other_row_booleans* {
    return [head].concat(tail);
  }

other_row_booleans
  = whitespace? "|" whitespace? boolean:boolean {
    return boolean;
  }

interface_variables
  = head:interface_variable tail:other_interface_variables* {
    return [head].concat(tail);
  }

other_interface_variables
  = whitespace? "," whitespace? interface_variable:interface_variable {
    return interface_variable;
  }

interface_variable
  = variable:variable bus_single:bus_single? {
    if (bus_single || bus_single === 0) {
      return [variable, bus_single];
    }
    else {
      return variable;
    }
  }

part_variable
  = variable:variable bus_suffix:bus_suffix? {
    if (bus_suffix || bus_suffix === 0) {
      return [variable, bus_suffix];
    }
    else {
      return variable;
    }
  }

bus_suffix
  = bus_single:bus_single {
    return [bus_single, bus_single]
  } / bus_range

variable
  = $([a-z][a-z0-9_]*)

bus_single
  = "[" whitespace? digits:$(digit+) whitespace? "]" {
    return parseInt(digits);
  }

bus_range
  = "[" whitespace? range:range whitespace? "]" {
    return range;
  }

range
  = left:$(digit+) ".." right:$(digit+) {
    return [parseInt(left), parseInt(right)];
  }

digit
  = [0-9]

boolean_bus
  = head:boolean tail:boolean+ {
    return [head].concat(tail);
  }

boolean
  = boolean:[01TF] {
    return boolean === "1" || boolean === "T";
  }

whitespace
  = ([ \t\r\n] / comment)+ {
    return " ";
  }

comment
  = "#" [^\r\n]* ([\r\n] / !.) {
    return "";
  }
