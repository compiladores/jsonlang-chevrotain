import { CompilangLexer } from "./lexer/index.ts";
import { parser } from "./parser/index.ts";
import { CSTVisitor } from "./CSTVisitor/index.ts";
import { TypeCheckerVisitor } from "./typeChecker/index.ts";

//TODO: arreglar typechecker para las cosas nuevas. (se tiene que chequear el tipo de a[1])
//TODO: arreglar jsonlang para las cosas nuevas
//TODO: tests de las cosas nuevas

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

  const jsonlang = CSTVisitor.visit(cst);
  return jsonlang;
}

console.log(
  JSON.stringify(
    run(`
    <a> = [1, 2, 3];
    <a[2]> = a[2];
    <b> = a.length->();
  `)
  )
);
