import { createToken, Lexer } from "https://esm.sh/chevrotain@10.4.1";

const createCategory = (name: string) =>
  createToken({ name, pattern: Lexer.NA });

export const Binop = createCategory("Binop");
export const Unop = createCategory("Unop");
