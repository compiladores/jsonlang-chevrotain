import { CompilangLexer } from "./lexer/index.ts";
import { parser } from "./parser/index.ts";
import { CSTVisitor } from "./CSTVisitor/index.ts";

export function run() {
  const res = CompilangLexer.tokenize(`
  ;
  break;
  continue;
  {
    break;
  }
  <x> = 1;
  while (1) {
    break;
  }
  do {
    continue;
  } until (1);
  <test(a, b, c)> { ; }
  test->(1, 1, 1);
  return 1;
  if (1) {;} elseif (1) {<x> = 1;} else {break;}
  for(x=1;1;1) {;}
  for(x=1;1;) {;}
  <v> = {
    a: -2
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
  console.log(ast);
}

run();
