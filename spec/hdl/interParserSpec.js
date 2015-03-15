/*jslint maxlen: 120 */

"use strict";

var describedClass = require("../../lib/hdl/interParser");

describe("InterParser", function () {
  describe("parsing an intermediate derived from a truth table", function () {
    var graph = describedClass.parse({
      inputs: ["a", "b"],
      outputs: ["out"],
      table: [
        [["a", false], ["b", false], ["out", true]],
        [["a", false], ["b", true],  ["out", true]],
        [["a", true],  ["b", false], ["out", true]],
        [["a", true],  ["b", true],  ["out", false]]
      ]
    });

    it("builds the correct graph", function () {
      var instance0 = graph.findBy({ name: "instance-0" });
      var instance1 = graph.findBy({ name: "instance-1" });
      var instance2 = graph.findBy({ name: "instance-2" });
      var instance3 = graph.findBy({ name: "instance-3" });
      var a         = graph.findBy({ name: "a" });
      var b         = graph.findBy({ name: "b" });
      var out       = graph.findBy({ name: "out" });
      var lookup    = graph.findBy({ name: "lookup" });

      expect(instance0.value.type).toEqual("instance");
      expect(instance1.value.type).toEqual("instance");
      expect(instance2.value.type).toEqual("instance");
      expect(instance3.value.type).toEqual("instance");
      expect(a.value.type).toEqual("input");
      expect(b.value.type).toEqual("input");
      expect(out.value.type).toEqual("output");
      expect(lookup.value.type).toEqual("chip");

      var edges = instance0.outEdges;

      expect(edges[0].destination).toEqual(lookup);
      expect(edges[1].destination).toEqual(a);
      expect(edges[2].destination).toEqual(b);
      expect(edges[3].destination).toEqual(out);

      expect(edges[0].value).toBeUndefined();
      expect(edges[1].value).toEqual(false);
      expect(edges[2].value).toEqual(false);
      expect(edges[3].value).toEqual(true);

      edges = instance1.outEdges;

      expect(edges[0].destination).toEqual(lookup);
      expect(edges[1].destination).toEqual(a);
      expect(edges[2].destination).toEqual(b);
      expect(edges[3].destination).toEqual(out);

      expect(edges[0].value).toBeUndefined();
      expect(edges[1].value).toEqual(false);
      expect(edges[2].value).toEqual(true);
      expect(edges[3].value).toEqual(true);

      edges = instance2.outEdges;

      expect(edges[0].destination).toEqual(lookup);
      expect(edges[1].destination).toEqual(a);
      expect(edges[2].destination).toEqual(b);
      expect(edges[3].destination).toEqual(out);

      expect(edges[0].value).toBeUndefined();
      expect(edges[1].value).toEqual(true);
      expect(edges[2].value).toEqual(false);
      expect(edges[3].value).toEqual(true);

      edges = instance3.outEdges;

      expect(edges[0].destination).toEqual(lookup);
      expect(edges[1].destination).toEqual(a);
      expect(edges[2].destination).toEqual(b);
      expect(edges[3].destination).toEqual(out);

      expect(edges[0].value).toBeUndefined();
      expect(edges[1].value).toEqual(true);
      expect(edges[2].value).toEqual(true);
      expect(edges[3].value).toEqual(false);

      expect(graph.nodes.length).toEqual(8);
      expect(graph.edges.length).toEqual(16);
    });
  });

  describe("parsing an intermediate derived from a list of parts", function () {
    var graph = describedClass.parse({
      inputs: ["a", "b"],
      outputs: ["out"],
      parts: [
        ["nand", [["a", "a"], ["b", "b"], ["out", "x"]]],
        ["nand", [["a", "x"], ["b", "x"], ["out", "out"]]]
      ]
    });

    it("builds the correct graph", function () {
      var instance0 = graph.findBy({ name: "instance-0" });
      var instance1 = graph.findBy({ name: "instance-1" });
      var a         = graph.findBy({ name: "a" });
      var b         = graph.findBy({ name: "b" });
      var out       = graph.findBy({ name: "out" });
      var x         = graph.findBy({ name: "x" });
      var nand      = graph.findBy({ name: "nand" });

      expect(instance0.value.type).toEqual("instance");
      expect(instance1.value.type).toEqual("instance");
      expect(a.value.type).toEqual("input");
      expect(b.value.type).toEqual("input");
      expect(out.value.type).toEqual("output");
      expect(x.value.type).toEqual("intermediate");
      expect(nand.value.type).toEqual("chip");

      var edges = instance0.outEdges;

      expect(edges[0].destination).toEqual(nand);
      expect(edges[1].destination).toEqual(a);
      expect(edges[2].destination).toEqual(b);
      expect(edges[3].destination).toEqual(x);

      expect(edges[0].value).toBeUndefined();
      expect(edges[1].value).toEqual({ name: "a"});
      expect(edges[2].value).toEqual({ name: "b"});
      expect(edges[3].value).toEqual({ name: "out"});

      edges = instance1.outEdges;

      expect(edges[0].destination).toEqual(nand);
      expect(edges[1].destination).toEqual(x);
      expect(edges[2].destination).toEqual(x);
      expect(edges[3].destination).toEqual(out);

      expect(edges[0].value).toBeUndefined();
      expect(edges[1].value).toEqual({ name: "a"});
      expect(edges[2].value).toEqual({ name: "b"});
      expect(edges[3].value).toEqual({ name: "out"});

      expect(graph.nodes.length).toEqual(7);
      expect(graph.edges.length).toEqual(8);
    });
  });

  describe("parsing a very complex intermediate", function () {
    var graph = describedClass.parse({
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
          ["b", "j"],
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
          ["out", "a_reg"],
          [["out", [0, 14]], "address_m"]
        ]],
        ["d_register", [
          ["in", "alu_output"],
          ["load", "load_d"],
          ["out", "d_reg"]
        ]],
        ["mux16", [
          ["a", "a_reg"],
          ["b", "in_m"],
          ["sel", ["instruction", [12, 12]]],
          ["out", "alu_input"]
        ]],
        ["alu", [
          ["x", "d_reg"],
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
          ["out", "j"]
        ]],
        ["counter", [
          ["in", "a_reg"],
          ["load", "load_pc"],
          ["inc", true],
          ["reset", "reset"],
          [["out", [0, 14]], "pc"]
        ]]
      ]
    });

    it("builds the correct graph", function () {
      // inputs
      var inM = graph.findBy({ name: "in_m" });
      var instruction = graph.findBy({ name: "instruction" });
      var reset = graph.findBy({ name: "reset" });

      expect(inM.value.type).toEqual("input");
      expect(instruction.value.type).toEqual("input");
      expect(reset.value.type).toEqual("input");

      // outputs
      var outM = graph.findBy({ name: "out_m" });
      var writeM = graph.findBy({ name: "write_m" });
      var addressM = graph.findBy({ name: "address_m" });
      var pc = graph.findBy({ name: "pc" });

      expect(outM.value.type).toEqual("output");
      expect(writeM.value.type).toEqual("output");
      expect(addressM.value.type).toEqual("output");
      expect(pc.value.type).toEqual("output");

      // intermediates
      var tru = graph.findBy({ name: "true" });
      var aInstruction = graph.findBy({ name: "a_instruction" });
      var loadA = graph.findBy({ name: "load_a" });
      var loadD = graph.findBy({ name: "load_d" });
      var j = graph.findBy({ name: "j" });
      var loadPC = graph.findBy({ name: "load_pc" });
      var aluOutput = graph.findBy({ name: "alu_output" });
      var aInput = graph.findBy({ name: "a_input" });
      var aReg = graph.findBy({ name: "a_reg" });
      var dReg = graph.findBy({ name: "d_reg" });
      var aluInput = graph.findBy({ name: "alu_input" });
      var zero = graph.findBy({ name: "zero" });
      var neg = graph.findBy({ name: "neg" });

      expect(tru.value.type).toEqual("intermediate");
      expect(aInstruction.value.type).toEqual("intermediate");
      expect(loadA.value.type).toEqual("intermediate");
      expect(loadD.value.type).toEqual("intermediate");
      expect(j.value.type).toEqual("intermediate");
      expect(loadPC.value.type).toEqual("intermediate");
      expect(aluOutput.value.type).toEqual("intermediate");
      expect(aInput.value.type).toEqual("intermediate");
      expect(aReg.value.type).toEqual("intermediate");
      expect(dReg.value.type).toEqual("intermediate");
      expect(aluInput.value.type).toEqual("intermediate");
      expect(zero.value.type).toEqual("intermediate");
      expect(neg.value.type).toEqual("intermediate");

      // chips
      var bool = graph.findBy({ name: "boolean" });
      var not = graph.findBy({ name: "not" });
      var or = graph.findBy({ name: "or" });
      var and = graph.findBy({ name: "and" });
      var mux16 = graph.findBy({ name: "mux16" });
      var aRegister = graph.findBy({ name: "a_register" });
      var dRegister = graph.findBy({ name: "d_register" });
      var alu = graph.findBy({ name: "alu" });
      var jump = graph.findBy({ name: "jump" });
      var counter = graph.findBy({ name: "counter" });

      expect(bool.value.type).toEqual("chip");
      expect(not.value.type).toEqual("chip");
      expect(or.value.type).toEqual("chip");
      expect(and.value.type).toEqual("chip");
      expect(mux16.value.type).toEqual("chip");
      expect(aRegister.value.type).toEqual("chip");
      expect(dRegister.value.type).toEqual("chip");
      expect(alu.value.type).toEqual("chip");
      expect(jump.value.type).toEqual("chip");
      expect(counter.value.type).toEqual("chip");

      // instances
      var instanceB = graph.findBy({ name: "instance-b" });
      var instance0 = graph.findBy({ name: "instance-0" });
      var instance1 = graph.findBy({ name: "instance-1" });
      var instance2 = graph.findBy({ name: "instance-2" });
      var instance3 = graph.findBy({ name: "instance-3" });
      var instance4 = graph.findBy({ name: "instance-4" });
      var instance5 = graph.findBy({ name: "instance-5" });
      var instance6 = graph.findBy({ name: "instance-6" });
      var instance7 = graph.findBy({ name: "instance-7" });
      var instance8 = graph.findBy({ name: "instance-8" });
      var instance9 = graph.findBy({ name: "instance-9" });
      var instance10 = graph.findBy({ name: "instance-10" });
      var instance11 = graph.findBy({ name: "instance-11" });

      expect(instanceB.value.type).toEqual("instance");
      expect(instance0.value.type).toEqual("instance");
      expect(instance1.value.type).toEqual("instance");
      expect(instance2.value.type).toEqual("instance");
      expect(instance3.value.type).toEqual("instance");
      expect(instance4.value.type).toEqual("instance");
      expect(instance5.value.type).toEqual("instance");
      expect(instance6.value.type).toEqual("instance");
      expect(instance7.value.type).toEqual("instance");
      expect(instance8.value.type).toEqual("instance");
      expect(instance9.value.type).toEqual("instance");
      expect(instance10.value.type).toEqual("instance");
      expect(instance11.value.type).toEqual("instance");

      // buses
      expect(inM.value.width).toEqual(16);
      expect(instruction.value.width).toEqual(16);
      expect(outM.value.width).toEqual(16);
      expect(addressM.value.width).toEqual(15);
      expect(pc.value.width).toEqual(15);

      // boolean chip
      var edges = instanceB.outEdges;
      expect(edges.length).toEqual(2);
      expect(edges[0].destination).toEqual(bool);
      expect(edges[1].destination).toEqual(tru);
      expect(edges[0].value).toBeUndefined();
      expect(edges[1].value).toEqual({ name: "true"});

      // ["not", [
      //   ["in", ["instruction", [15, 15]]],
      //   ["out", "a_instruction"]
      // ]],
      edges = instance0.outEdges;
      expect(edges.length).toEqual(3);
      expect(edges[0].destination).toEqual(not);
      expect(edges[1].destination).toEqual(instruction);
      expect(edges[2].destination).toEqual(aInstruction);
      expect(edges[0].value).toBeUndefined();
      expect(edges[1].value).toEqual({ name: "in", thisStart: 15, thisEnd: 15 });
      expect(edges[2].value).toEqual({ name: "out" });

      // ["or", [
      //   ["a", "a_instruction"],
      //   ["b", ["instruction", [5, 5]]],
      //   ["out", "load_a"]
      // ]],
      edges = instance1.outEdges;
      expect(edges.length).toEqual(4);
      expect(edges[0].destination).toEqual(or);
      expect(edges[1].destination).toEqual(aInstruction);
      expect(edges[2].destination).toEqual(instruction);
      expect(edges[3].destination).toEqual(loadA);
      expect(edges[0].value).toBeUndefined();
      expect(edges[1].value).toEqual({ name: "a" });
      expect(edges[2].value).toEqual({ name: "b", thisStart: 5, thisEnd: 5 });
      expect(edges[3].value).toEqual({ name: "out" });

      // ["and", [
      //   ["a", ["instruction", [15, 15]]],
      //   ["b", ["instruction", [4, 4]]],
      //   ["out", "load_d"]
      // ]],
      edges = instance2.outEdges;
      expect(edges.length).toEqual(4);
      expect(edges[0].destination).toEqual(and);
      expect(edges[1].destination).toEqual(instruction);
      expect(edges[2].destination).toEqual(instruction);
      expect(edges[3].destination).toEqual(loadD);
      expect(edges[0].value).toBeUndefined();
      expect(edges[1].value).toEqual({ name: "a", thisStart: 15, thisEnd: 15 });
      expect(edges[2].value).toEqual({ name: "b", thisStart: 4, thisEnd: 4 });
      expect(edges[3].value).toEqual({ name: "out" });

      // ["and", [
      //   ["a", ["instruction", [15, 15]]],
      //   ["b", "j"],
      //   ["out", "load_pc"]
      // ]],
      edges = instance3.outEdges;
      expect(edges.length).toEqual(4);
      expect(edges[0].destination).toEqual(and);
      expect(edges[1].destination).toEqual(instruction);
      expect(edges[2].destination).toEqual(j);
      expect(edges[3].destination).toEqual(loadPC);
      expect(edges[0].value).toBeUndefined();
      expect(edges[1].value).toEqual({ name: "a", thisStart: 15, thisEnd: 15 });
      expect(edges[2].value).toEqual({ name: "b" });
      expect(edges[3].value).toEqual({ name: "out" });

      // ["and", [
      //   ["a", ["instruction", [15, 15]]],
      //   ["b", ["instruction", [3, 3]]],
      //   ["out", "write_m"]
      // ]],
      edges = instance4.outEdges;
      expect(edges.length).toEqual(4);
      expect(edges[0].destination).toEqual(and);
      expect(edges[1].destination).toEqual(instruction);
      expect(edges[2].destination).toEqual(instruction);
      expect(edges[3].destination).toEqual(writeM);
      expect(edges[0].value).toBeUndefined();
      expect(edges[1].value).toEqual({ name: "a", thisStart: 15, thisEnd: 15 });
      expect(edges[2].value).toEqual({ name: "b", thisStart: 3, thisEnd: 3 });
      expect(edges[3].value).toEqual({ name: "out" });

      // ["mux16", [
      //   ["a", "alu_output"],
      //   ["b", "instruction"],
      //   ["sel", "a_instruction"],
      //   ["out", "a_input"]
      // ]],
      edges = instance5.outEdges;
      expect(edges.length).toEqual(5);
      expect(edges[0].destination).toEqual(mux16);
      expect(edges[1].destination).toEqual(aluOutput);
      expect(edges[2].destination).toEqual(instruction);
      expect(edges[3].destination).toEqual(aInstruction);
      expect(edges[4].destination).toEqual(aInput);
      expect(edges[0].value).toBeUndefined();
      expect(edges[1].value).toEqual({ name: "a" });
      expect(edges[2].value).toEqual({ name: "b" });
      expect(edges[3].value).toEqual({ name: "sel" });
      expect(edges[4].value).toEqual({ name: "out" });

      // ["a_register", [
      //   ["in", "a_input"],
      //   ["load", "load_a"],
      //   ["out", "a_reg"],
      //   [["out", [0, 14]], "address_m"]
      // ]],
      edges = instance6.outEdges;
      expect(edges.length).toEqual(5);
      expect(edges[0].destination).toEqual(aRegister);
      expect(edges[1].destination).toEqual(aInput);
      expect(edges[2].destination).toEqual(loadA);
      expect(edges[3].destination).toEqual(aReg);
      expect(edges[4].destination).toEqual(addressM);
      expect(edges[0].value).toBeUndefined();
      expect(edges[1].value).toEqual({ name: "in" });
      expect(edges[2].value).toEqual({ name: "load" });
      expect(edges[3].value).toEqual({ name: "out" });
      expect(edges[4].value).toEqual({ name: "out", otherStart: 0, otherEnd: 14 });

      // ["d_register", [
      //   ["in", "alu_output"],
      //   ["load", "load_d"],
      //   ["out", "d_reg"]
      // ]],
      edges = instance7.outEdges;
      expect(edges.length).toEqual(4);
      expect(edges[0].destination).toEqual(dRegister);
      expect(edges[1].destination).toEqual(aluOutput);
      expect(edges[2].destination).toEqual(loadD);
      expect(edges[3].destination).toEqual(dReg);
      expect(edges[0].value).toBeUndefined();
      expect(edges[1].value).toEqual({ name: "in" });
      expect(edges[2].value).toEqual({ name: "load" });
      expect(edges[3].value).toEqual({ name: "out" });

      // ["mux16", [
      //   ["a", "a_reg"],
      //   ["b", "in_m"],
      //   ["sel", ["instruction", [12, 12]]],
      //   ["out", "alu_input"]
      // ]],
      edges = instance8.outEdges;
      expect(edges.length).toEqual(5);
      expect(edges[0].destination).toEqual(mux16);
      expect(edges[1].destination).toEqual(aReg);
      expect(edges[2].destination).toEqual(inM);
      expect(edges[3].destination).toEqual(instruction);
      expect(edges[4].destination).toEqual(aluInput);
      expect(edges[0].value).toBeUndefined();
      expect(edges[1].value).toEqual({ name: "a" });
      expect(edges[2].value).toEqual({ name: "b" });
      expect(edges[3].value).toEqual({ name: "sel", thisStart: 12, thisEnd: 12 });
      expect(edges[4].value).toEqual({ name: "out" });

      // ["alu", [
      //   ["x", "d_reg"],
      //   ["y", "alu_input"],
      //   ["zx", ["instruction", [11, 11]]],
      //   ["nx", ["instruction", [10, 10]]],
      //   ["zy", ["instruction", [9, 9]]],
      //   ["ny", ["instruction", [8, 8]]],
      //   ["f",  ["instruction", [7, 7]]],
      //   ["no", ["instruction", [6, 6]]],
      //   ["out", "alu_output"],
      //   ["out", "out_m"],
      //   ["zr", "zero"],
      //   ["ng", "neg"]
      // ]],
      edges = instance9.outEdges;
      expect(edges.length).toEqual(13);
      expect(edges[0].destination).toEqual(alu);
      expect(edges[1].destination).toEqual(dReg);
      expect(edges[2].destination).toEqual(aluInput);
      expect(edges[3].destination).toEqual(instruction);
      expect(edges[4].destination).toEqual(instruction);
      expect(edges[5].destination).toEqual(instruction);
      expect(edges[6].destination).toEqual(instruction);
      expect(edges[7].destination).toEqual(instruction);
      expect(edges[8].destination).toEqual(instruction);
      expect(edges[9].destination).toEqual(aluOutput);
      expect(edges[10].destination).toEqual(outM);
      expect(edges[11].destination).toEqual(zero);
      expect(edges[12].destination).toEqual(neg);
      expect(edges[0].value).toBeUndefined();
      expect(edges[1].value).toEqual({ name: "x" });
      expect(edges[2].value).toEqual({ name: "y" });
      expect(edges[3].value).toEqual({ name: "zx", thisStart: 11, thisEnd: 11 });
      expect(edges[4].value).toEqual({ name: "nx", thisStart: 10, thisEnd: 10 });
      expect(edges[5].value).toEqual({ name: "zy", thisStart: 9, thisEnd: 9 });
      expect(edges[6].value).toEqual({ name: "ny", thisStart: 8, thisEnd: 8 });
      expect(edges[7].value).toEqual({ name: "f", thisStart: 7, thisEnd: 7});
      expect(edges[8].value).toEqual({ name: "no", thisStart: 6, thisEnd: 6 });
      expect(edges[9].value).toEqual({ name: "out" });
      expect(edges[10].value).toEqual({ name: "out" });
      expect(edges[11].value).toEqual({ name: "zr" });
      expect(edges[12].value).toEqual({ name: "ng" });

      // ["jump", [
      //   ["zero", "zero"],
      //   ["neg", "neg"],
      //   ["code", ["instruction", [0, 2]]],
      //   ["out", "j"]
      // ]],
      edges = instance10.outEdges;
      expect(edges.length).toEqual(5);
      expect(edges[0].destination).toEqual(jump);
      expect(edges[1].destination).toEqual(zero);
      expect(edges[2].destination).toEqual(neg);
      expect(edges[3].destination).toEqual(instruction);
      expect(edges[4].destination).toEqual(j);
      expect(edges[0].value).toBeUndefined();
      expect(edges[1].value).toEqual({ name: "zero" });
      expect(edges[2].value).toEqual({ name: "neg" });
      expect(edges[3].value).toEqual({ name: "code", thisStart: 0, thisEnd: 2 });
      expect(edges[4].value).toEqual({ name: "out" });

      // ["counter", [
      //   ["in", "a_reg"],
      //   ["load", "load_pc"],
      //   ["inc", true],
      //   ["reset", "reset"],
      //   [["out", [0, 14]], "pc"]
      // ]]
      edges = instance11.outEdges;
      expect(edges.length).toEqual(6);
      expect(edges[0].destination).toEqual(counter);
      expect(edges[1].destination).toEqual(aReg);
      expect(edges[2].destination).toEqual(loadPC);
      expect(edges[3].destination).toEqual(tru);
      expect(edges[4].destination).toEqual(reset);
      expect(edges[5].destination).toEqual(pc);
      expect(edges[0].value).toBeUndefined();
      expect(edges[1].value).toEqual({ name: "in" });
      expect(edges[2].value).toEqual({ name: "load" });
      expect(edges[3].value).toEqual({ name: "inc" });
      expect(edges[4].value).toEqual({ name: "reset" });
      expect(edges[5].value).toEqual({ name: "out", otherStart: 0, otherEnd: 14 });

      // check that everything is accounted for
      expect(graph.nodes.length).toEqual(43);
      expect(graph.edges.length).toEqual(64);
    });
  });
});
