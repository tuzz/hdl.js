/*jslint maxlen: 120 */

"use strict";

var describedClass = require("../../lib/hdl/inputParser");

describe("InputParser", function () {
  it("parses truth tables", function () {
    var result = describedClass.parse("  \n\
      # nand                              \n\
                                          \n\
      inputs a, b                         \n\
      outputs out                         \n\
                                          \n\
      | a | b | out |                     \n\
      | 0 | 0 |  T  |                     \n\
      | 0 | 1 |  T  |                     \n\
      | 1 | 0 |  T  |                     \n\
      | 1 | 1 |  F  |                     \n\
    ");

    expect(result).toEqual({
      inputs: ["a", "b"],
      outputs: ["out"],
      table: [
        [["a", false], ["b", false], ["out", true]],
        [["a", false], ["b", true],  ["out", true]],
        [["a", true],  ["b", false], ["out", true]],
        [["a", true],  ["b", true],  ["out", false]]
      ]
    });
  });

  it("parses chips with parts", function () {
    var result = describedClass.parse("  \n\
      # and                               \n\
      inputs a, b                         \n\
      outputs out                         \n\
                                          \n\
      nand(a=a, b=b, out=x)               \n\
      nand(a=x, b=x, out=out)             \n\
    ");

    expect(result).toEqual({
      inputs: ["a", "b"],
      outputs: ["out"],
      parts: [
        ["nand", [["a", "a"], ["b", "b"], ["out", "x"]]],
        ["nand", [["a", "x"], ["b", "x"], ["out", "out"]]]
      ]
    });
  });

  it("parses a very complex example", function () {
    var result = describedClass.parse("                                                      \n\
      inputs                                                                                  \n\
        in_m[16],        # M value input  (M = contents of RAM[A])                            \n\
        instruction[16], # Instruction for execution                                          \n\
        reset            # Signals whether to re-start the current program                    \n\
                         # (reset == 1) or continue executing the current                     \n\
                         # program (reset == 0).                                              \n\
                                                                                              \n\
      outputs                                                                                 \n\
        out_m[16],       # M value output                                                     \n\
        write_m,         # Write into M?                                                      \n\
        address_m[15],   # RAM address (of M)                                                 \n\
        pc[15]           # ROM address (of next instruction)                                  \n\
                                                                                              \n\
      # i  _  _  a  c1 c2 c3 c4 c5 c6 d1 d2 d3 j1 j2 j3                                       \n\
      # 15 14 13 12 11 10 09 08 07 06 05 04 03 02 01 00                                       \n\
                                                                                              \n\
      not(in=instruction[15], out=a_instruction)                                              \n\
                                                                                              \n\
      # Set the A-register if an A-instruction is issued or it is specified as a location.    \n\
      or(a=a_instruction, b=instruction[5], out=load_a)                                       \n\
                                                                                              \n\
      # Don't write to the other data locations if an A-instruction is issued.                \n\
      and(a=instruction[15], b=instruction[4], out=load_d)                                    \n\
      and(a=instruction[15], b=jump, out=load_pc)                                             \n\
      and(a=instruction[15], b=instruction[3], out=write_m)                                   \n\
                                                                                              \n\
      # Treat the instruction as a constant if an A-instruction is issued.                    \n\
      mux16(a=alu_output, b=instruction, sel=a_instruction, out=a_input)                      \n\
                                                                                              \n\
      # Set the registers according to the proposed architecture.                             \n\
      a_register(in=a_input, load=load_a, out=a_register, out[0..14]=address_m)               \n\
      d_register(in=alu_output, load=load_d, out=d_register)                                  \n\
                                                                                              \n\
      # Conditionally read from memory or the A-register.                                     \n\
      mux16(a=a_register, b=in_m, sel=instruction[12], out=alu_input)                         \n\
                                                                                              \n\
      # Configure the ALU with the control bits.                                              \n\
      alu(                                                                                    \n\
                                                                                              \n\
        # Inputs                                                                              \n\
                                                                                              \n\
        x=d_register,                                                                         \n\
        y=alu_input,                                                                          \n\
        zx=instruction[11], # c1                                                              \n\
        nx=instruction[10], # c2                                                              \n\
        zy=instruction[9],  # c3                                                              \n\
        ny=instruction[8],  # c4                                                              \n\
        f=instruction[7],   # c5                                                              \n\
        no=instruction[6],  # c6                                                              \n\
                                                                                              \n\
        # Outputs                                                                             \n\
                                                                                              \n\
        out=alu_output,                                                                       \n\
        out=out_m,                                                                            \n\
        zr=zero,                                                                              \n\
        ng=neg                                                                                \n\
                                                                                              \n\
      )                                                                                       \n\
                                                                                              \n\
      # The conditional jump logic has been extracted into Jump.hdl.                          \n\
      jump(zero=zero, neg=neg, code=instruction[0..2], out=jump)                              \n\
                                                                                              \n\
      # Increment the program counter, or load a new value from the A-register.               \n\
      pc(in=a_register, load=load_ps, inc=T, reset=reset, out[0..14]=pc)                      \n\
                                                                                              \n\
      # Added to test clocked parts                                                           \n\
      _clocked(in=out, a[1]=b[2..3], c=T)                                                     \n\
    ");

    expect(result).toEqual({
      inputs : [
        ["in_m", 16],
        ["instruction", 16],
        "reset"
      ],
      outputs : [
        ["out_m", 16],
        "write_m",
        ["address_m", 15],
        ["pc", 15]
      ],
      parts : [
        ["not", [
          ["in", ["instruction", [15, 15]]],
          ["out", "a_instruction"]
        ]],
        ["or", [
          ["a", "a_instruction"],
          ["b", ["instruction", [5, 5]]],
          ["out", "load_a"]
        ]],
        ["and", [
          ["a", ["instruction", [15, 15]]],
          ["b", ["instruction", [4, 4]]],
          ["out", "load_d"]
        ]],
        ["and", [
          ["a", ["instruction", [15, 15]]],
          ["b", "jump"],
          ["out", "load_pc"]
        ]],
        ["and", [
          ["a", ["instruction", [15, 15]]],
          ["b", ["instruction", [3, 3]]],
          ["out", "write_m"]
        ]],
        ["mux16", [
          ["a", "alu_output"],
          ["b", "instruction"],
          ["sel", "a_instruction"],
          ["out", "a_input"]
        ]],
        ["a_register", [
          ["in", "a_input"],
          ["load", "load_a"],
          ["out", "a_register"],
          [["out", [0, 14]], "address_m"]
        ]],
        ["d_register", [
          ["in", "alu_output"],
          ["load", "load_d"],
          ["out", "d_register"]
        ]],
        ["mux16", [
          ["a", "a_register"],
          ["b", "in_m"],
          ["sel", ["instruction", [12, 12]]],
          ["out", "alu_input"]
        ]],
        ["alu", [
          ["x", "d_register"],
          ["y", "alu_input"],
          ["zx", ["instruction", [11, 11]]],
          ["nx", ["instruction", [10, 10]]],
          ["zy", ["instruction", [9, 9]]],
          ["ny", ["instruction", [8, 8]]],
          ["f",  ["instruction", [7, 7]]],
          ["no", ["instruction", [6, 6]]],
          ["out", "alu_output"],
          ["out", "out_m"],
          ["zr", "zero"],
          ["ng", "neg"]
        ]],
        ["jump", [
          ["zero", "zero"],
          ["neg", "neg"],
          ["code", ["instruction", [0, 2]]],
          ["out", "jump"]
        ]],
        ["pc", [
          ["in", "a_register"],
          ["load", "load_ps"],
          ["inc", true],
          ["reset", "reset"],
          [["out", [0, 14]], "pc"]
        ]],
        ["_clocked", [
          ["in", "out"],
          [["a", [1, 1]], ["b", [2, 3]]],
          ["c", true ]
        ]]
      ]
    });
  });

});
