import { CompilangLexer } from "./lexer/index.ts";
import { parser } from "./parser/index.ts";
import { CSTVisitor } from "./CSTVisitor/index.ts";
import { TypeCheckerVisitor } from "./typeChecker/index.ts";

export function run(code: string) {
  const res = CompilangLexer.tokenize(code);

  parser.input = res.tokens;
  const cst = parser.topRule();
  if (parser.errors.length > 0) {
    throw Error("Parsing errors detected!\n" + parser.errors[0].message);
  } else {
    console.log("Parsing successful.");
  }

  const typeCheckerVisitor = new TypeCheckerVisitor();
  try {
    const typeCheckRes = typeCheckerVisitor.visit(cst);
    if (!typeCheckRes?.error) console.log("Type check successful.");
  } catch (e) {
    console.warn(e);
    return e;
  }

  const ast = CSTVisitor.visit(cst);
  return ast;
}

console.log(
  JSON.stringify(
    run(`
    <test(a: number, b: number): number> {
      return a + b;
    }
    <x: number> = test->("asd", "asd");
  `)
  )
);
