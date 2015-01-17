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
  = "inputs" whitespace variables:variables {
    return variables;
  }

outputs
  = "outputs" whitespace variables:variables {
    return variables;
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
  = variable:variable "(" whitespace? assignments:assignments whitespace? ")" {
    return [variable, assignments];
  }

assignments
  = head:assignment tail:other_assignments* {
    return [head].concat(tail);
  }

other_assignments
  = whitespace? "," whitespace? assignment:assignment {
    return assignment;
  }

assignment
  = left:variable whitespace? "=" whitespace? right:(variable / boolean) {
    return [left, right];
  }

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

variables
  = head:variable tail:other_variables* {
    return [head].concat(tail);
  }

other_variables
  = whitespace? "," whitespace? variable:variable {
    return variable;
  }

variable
  = $([a-z][a-z0-9_]*)

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
