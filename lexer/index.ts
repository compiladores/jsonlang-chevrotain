import { Lexer } from "https://esm.sh/chevrotain@10.4.1";
import { tokens } from "./tokens.ts";

export const CompilangLexer = new Lexer(tokens);
