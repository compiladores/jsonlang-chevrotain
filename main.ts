import { CompilangLexer } from "./lexer/index.ts";
import { parser } from "./parser/index.ts";
import { CSTVisitor } from "./CSTVisitor/index.ts";

export function run() {
  const res = CompilangLexer.tokenize(`
  <v> = {
    a: sum->(2, 3),
    b: [1, 2]
  };
  `);

  parser.input = res.tokens;
  const cst = parser.topRule();
  if (parser.errors.length > 0) {
    throw Error("Parsing errors detected!\n" + parser.errors[0].message);
  } else {
    console.log("Parsing successful.");
  }

  const ast = CSTVisitor.visit(cst);
  console.log(JSON.stringify(ast));
}

run();
