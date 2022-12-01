import { CompilangLexer } from "./lexer/index.ts";
import { parser } from "./parser/index.ts";
import { CSTVisitor } from "./CSTVisitor/index.ts";
import { typeCheckerVisitor } from "./typeChecker/index.ts";

//TODO: generar tipos de ts con lo nuevo del parser
//TODO: precedencia en expresiones
//TODO: si necesito que no sea infinito el diccionario/array separar simpleExpression dejandole
//      solo los basicos, y que haya otro que es extendedSimpleExpression o algo asi.
//TODO: chequear tipos

export function run(code: string) {
  const res = CompilangLexer.tokenize(code);

  parser.input = res.tokens;
  const cst = parser.topRule();
  if (parser.errors.length > 0) {
    throw Error("Parsing errors detected!\n" + parser.errors[0].message);
  } else {
    console.log("Parsing successful.");
  }

  const typeCheckRes = typeCheckerVisitor.visit(cst);
  if (!typeCheckRes?.error) console.log("Type check successful.");

  const ast = CSTVisitor.visit(cst);
  return ast;
}

console.log(
  JSON.stringify(
    run(`
    <x> = 1;
    <y> = -2;
    while (5 + y + x ne 75) {
      <x> = x * 2;
      <y> = x + 5;
    }
    do {
      <x> = x / 2;
    } until (x lte 0);
  `)
  )
);
