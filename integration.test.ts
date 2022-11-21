import { assertEquals } from "https://deno.land/std@0.155.0/testing/asserts.ts";
import { run } from "./main.ts";

Deno.test("empty", () => {
  const res = run(`;`);
  assertEquals(res, ["noop"]);
});

Deno.test("break and continue", () => {
  const res = run(`
    break;
    continue;
  `);
  assertEquals(res, ["break", "continue"]);
});

Deno.test("return and multiple expressions", () => {
  const res = run(`
  return "asd";
  return 1;
  return true;
  return false;
  return "false";
  return x;
  return not x;
  return -----1;
  return 1 + 2;
  return 1 + 2 + 3 + 4 + -5;
  return [x, "y", 1, 1 + 2, not false];
  return { name: "Test", age: 30, test: [1, 2, 3] };
  return sum->(2,3);
`);
  console.log(JSON.stringify(res));
  assertEquals(res, [
    { return: "asd" },
    { return: 1 },
    { return: true },
    { return: false },
    { return: "false" },
    { return: "x" },
    { return: { unop: "not", arg: "x" } },
    {
      return: {
        unop: "-",
        arg: {
          unop: "-",
          arg: { unop: "-", arg: { unop: "-", arg: { unop: "-", arg: 1 } } },
        },
      },
    },
    { return: { binop: "+", argl: 1, argr: 2 } },
    {
      return: {
        binop: "+",
        argl: 1,
        argr: {
          binop: "+",
          argl: 2,
          argr: {
            binop: "+",
            argl: 3,
            argr: { binop: "+", argl: 4, argr: { unop: "-", arg: 5 } },
          },
        },
      },
    },
    {
      return: [
        "x",
        "y",
        1,
        { binop: "+", argl: 1, argr: 2 },
        { unop: "not", arg: false },
      ],
    },
    { return: { dict: [{ name: "Test" }, { age: 30 }, { test: [1, 2, 3] }] } },
    { return: { call: "sum", args: [2, 3] } },
  ]);
});

Deno.test("simple if", () => {
  const res = run(`if (1) {;}`);
  assertEquals(res, [{ if: [{ cond: 1, then: ["noop"] }] }]);
});

Deno.test("if and else", () => {
  const res = run(`if (x gte y) {;} else {;}`);
  assertEquals(res, [
    {
      if: [{ cond: { binop: "gte", argl: "x", argr: "y" }, then: ["noop"] }],
      else: ["noop"],
    },
  ]);
});

Deno.test("multiple if clauses", () => {
  const res = run(`
    if (x eq 90) {
      ;
    } elseif (false) {
      break;
    } else {
      continue;
    }
  `);
  assertEquals(res, [
    {
      if: [
        { cond: { binop: "eq", argl: "x", argr: 90 }, then: ["noop"] },
        { cond: false, then: ["break"] },
      ],
      else: ["continue"],
    },
  ]);
});

Deno.test("iterator", () => {
  const res = run(`
    for (i = 1; 10; 2) {
      <z> = i;
    }
  `);
  assertEquals(res, [
    {
      iterator: "i",
      from: 1,
      to: 10,
      step: 2,
      do: [{ set: "z", value: "i" }],
    },
  ]);
});

Deno.test("while and do-until", () => {
  const res = run(`
    <x> = 1;
    <y> = -2;
    while (5 + y + x ne 75) {
      <x> = x * 2;
      <y> = x + 5;
    }
    do {
      <x> = x / 2;
    } until (x lte 0);
  `);
  assertEquals(res, [
    { set: "x", value: 1 },
    { set: "y", value: { unop: "-", arg: 2 } },
    {
      while: {
        binop: "+",
        argl: 5,
        argr: {
          binop: "+",
          argl: "y",
          argr: { binop: "ne", argl: "x", argr: 75 },
        },
      },
      do: [
        { set: "x", value: { binop: "*", argl: "x", argr: 2 } },
        { set: "y", value: { binop: "+", argl: "x", argr: 5 } },
      ],
    },
    {
      do: [{ set: "x", value: { binop: "/", argl: "x", argr: 2 } }],
      until: { binop: "lte", argl: "x", argr: 0 },
    },
  ]);
});

Deno.test("block", () => {
  const res = run(`
    <x> = 1;
    {
      ;
      {
        <x> = 2;
      }
    }
  `);
  assertEquals(res, [
    { set: "x", value: 1 },
    ["noop", [{ set: "x", value: 2 }]],
  ]);
});

Deno.test("function and call", () => {
  const res = run(`
    <test(a, b)> {
      return a + b;
    }
    test->(2, x + -y);
  `);
  assertEquals(res, [
    {
      function: "test",
      args: ["a", "b"],
      block: [{ return: { binop: "+", argl: "a", argr: "b" } }],
    },
    {
      call: "test",
      args: [2, { binop: "+", argl: "x", argr: { unop: "-", arg: "y" } }],
    },
  ]);
});

//TODO: types/structs
