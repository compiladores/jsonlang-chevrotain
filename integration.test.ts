import { assertEquals } from "https://deno.land/std@0.155.0/testing/asserts.ts";
import { run } from "./main.ts";
import { IncompatibleTypesError } from "./typeChecker/typeError.ts";

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
  <x> = 1;
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
  assertEquals(res, [
    { set: "x", value: 1 },
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
        argl: {
          binop: "+",
          argl: { binop: "+", argl: { binop: "+", argl: 1, argr: 2 }, argr: 3 },
          argr: 4,
        },
        argr: { unop: "-", arg: 5 },
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

Deno.test("precedence", () => {
  const res = run(`
    return 1 + 3 * 5 eq x lt y and true;
  `);
  assertEquals(res, [
    {
      return: {
        binop: "and",
        argl: {
          binop: "eq",
          argl: { binop: "+", argl: 1, argr: { binop: "*", argl: 3, argr: 5 } },
          argr: { binop: "lt", argl: "x", argr: "y" },
        },
        argr: true,
      },
    },
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
    if (7 + 8 eq 90) {
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
        {
          cond: {
            binop: "eq",
            argl: { binop: "+", argl: 7, argr: 8 },
            argr: 90,
          },
          then: ["noop"],
        },
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
        binop: "ne",
        argl: {
          binop: "+",
          argl: { binop: "+", argl: 5, argr: "y" },
          argr: "x",
        },
        argr: 75,
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

Deno.test("variables with regular types", () => {
  const res = run(`
    <x: number> = 1;
    <y: string> = "asd";
    <z: array> = [];
  `);
  assertEquals(res, [
    { set: "x", value: 1 },
    { set: "y", value: "asd" },
    { set: "z", value: [] },
  ]);
});

Deno.test("throws if type mismatch", () => {
  const res: IncompatibleTypesError = run(`<x: number> = "asd";`);
  assertEquals(res.message, `Type "string" is not assignable to type "number"`);
});

Deno.test("throws if type mismatch in implicit use", () => {
  const res: IncompatibleTypesError = run(`
    <x> = "asd";
    <y> = 1 + 2;
    <x> = y;
  `);
  assertEquals(res.message, `Type "number" is not assignable to type "string"`);
});

Deno.test("throws if type undefined", () => {
  const res: IncompatibleTypesError = run(`
    <x: Person> = { name: "Test", age: 40};
  `);
  assertEquals(res.message, `Cannot find name "Person"`);
});

Deno.test("js magic not allowed", () => {
  const res: Error = run(`<x> = 1 + "asd";`);
  const res2: Error = run(`<y> = - not 4;`);
  const res3: Error = run(`<z> = [1, 2] * 6;`);
  assertEquals(res.message, "Invalid expression");
  assertEquals(res2.message, "Invalid expression");
  assertEquals(res3.message, "Invalid expression");
});

Deno.test("string concatenation using +", () => {
  const res = run(`<x> = "aaa" + "bbb";`);
  assertEquals(res, [
    { set: "x", value: { binop: "+", argl: "aaa", argr: "bbb" } },
  ]);
});

Deno.test("function and call with types", () => {
  const res = run(`
    <test(a: number, b: number): number> {
      return a + b;
    }
    test->(2, 10 + -1);
  `);
  assertEquals(res, [
    {
      function: "test",
      args: ["a", "b"],
      block: [{ return: { binop: "+", argl: "a", argr: "b" } }],
    },
    {
      call: "test",
      args: [2, { binop: "+", argl: 10, argr: { unop: "-", arg: 1 } }],
    },
  ]);
});

Deno.test("custom types", () => {
  const res = run(`
    <<Person>> {
      name: string;
      age: number;
    }
    <w: Person> = {
      name: "test",
      age: 30
    };
    <make_person(n: string, a: number): Person> {
      return { name: n, age: a };
    }
    <person: Person> = make_person->("Other", 45);
  `);
  assertEquals(res, []);
});

Deno.test("cannot redefine type", () => {
  const res: Error = run(`
    <<Person>> {
      name: string;
      age: number;
    }
    <<Person>> {
      name: string;
    }
  `);
  assertEquals(res.message, "Type already defined");
});
