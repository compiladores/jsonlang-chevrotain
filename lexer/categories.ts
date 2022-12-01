import { createToken, Lexer } from "https://esm.sh/chevrotain@10.4.1";

const createCategory = (name: string) =>
  createToken({ name, pattern: Lexer.NA });

export const LogicalBinop = createCategory("LogicalBinop");
export const EqualtyBinop = createCategory("EqualtyBinop");
export const ComparisonBinop = createCategory("ComparisonBinop");
export const TermBinop = createCategory("TermBinop");
export const FactorBinop = createCategory("FactorBinop");
export const Unop = createCategory("Unop");
