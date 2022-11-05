import { createToken, Lexer } from "https://esm.sh/chevrotain@10.4.1";

export const Binop = createToken({
  name: "Binop",
  pattern: Lexer.NA,
});
export const Unop = createToken({
  name: "Unop",
  pattern: Lexer.NA,
});
