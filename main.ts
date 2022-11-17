import { CompilangLexer } from "./lexer/index.ts";
import { CompilangParser } from "./parser/index.ts";

const parser = new CompilangParser();

export function run() {
  const res = CompilangLexer.tokenize("asd->(1);");
  parser.input = res.tokens;
  parser.topRule();

  if (parser.errors.length > 0) {
    throw Error("Parsing errors detected!\n" + parser.errors[0].message);
  } else {
    console.log("Parsing successful.");
  }
}

run();
