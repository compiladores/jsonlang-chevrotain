import { CompilangLexer } from "./lexer/index.ts";

export function run() {
  const res = CompilangLexer.tokenize('<x> = "asd" + -1');
  console.log(res);
}

run();
