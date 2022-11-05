import { createToken, Lexer } from "https://esm.sh/chevrotain@10.4.1";
import { Binop, Unop } from "./categories.ts";

const Identifier = createToken({
  name: "Identifier",
  pattern: /[a-zA-Z]\w*/,
});
const StringLiteral = createToken({
  name: "StringLiteral",
  pattern: /"(?:""|[^"])*"/,
});
const Integer = createToken({ name: "Integer", pattern: /0|[1-9]\d*/ });
const If = createToken({
  name: "If",
  pattern: /if/,
  longer_alt: Identifier,
});
const Else = createToken({
  name: "Else",
  pattern: /else/,
  longer_alt: Identifier,
});
const While = createToken({
  name: "While",
  pattern: /while/,
  longer_alt: Identifier,
});
const Return = createToken({
  name: "Return",
  pattern: /return/,
  longer_alt: Identifier,
});
const Continue = createToken({
  name: "Continue",
  pattern: /continue/,
  longer_alt: Identifier,
});
const Break = createToken({
  name: "Break",
  pattern: /break/,
  longer_alt: Identifier,
});
const For = createToken({
  name: "For",
  pattern: /for/,
  longer_alt: Identifier,
});
const And = createToken({
  name: "And",
  pattern: /and/,
  longer_alt: Identifier,
  categories: [Binop],
});
const Or = createToken({
  name: "Or",
  pattern: /or/,
  longer_alt: Identifier,
  categories: [Binop],
});
const Not = createToken({
  name: "Not",
  pattern: /not/,
  longer_alt: Identifier,
  categories: [Unop],
});
const Eq = createToken({
  name: "Eq",
  pattern: /eq/,
  longer_alt: Identifier,
  categories: [Binop],
});
const Ne = createToken({
  name: "Ne",
  pattern: /ne/,
  longer_alt: Identifier,
  categories: [Binop],
});
const Gt = createToken({
  name: "Gt",
  pattern: /gt/,
  longer_alt: Identifier,
  categories: [Binop],
});
const Gte = createToken({
  name: "Gte",
  pattern: /gte/,
  longer_alt: Identifier,
  categories: [Binop],
});
const Lt = createToken({
  name: "Lt",
  pattern: /lt/,
  longer_alt: Identifier,
  categories: [Binop],
});
const Lte = createToken({
  name: "Lte",
  pattern: /lte/,
  longer_alt: Identifier,
  categories: [Binop],
});
const LCurly = createToken({ name: "LCurly", pattern: /\{/ });
const RCurly = createToken({ name: "RCurly", pattern: /\}/ });
const LParen = createToken({ name: "LParen", pattern: /\(/ });
const Equals = createToken({ name: "Equals", pattern: /\=/ });
const RParen = createToken({ name: "RParen", pattern: /\)/ });
const LBracket = createToken({ name: "LBracket", pattern: /\</ });
const RBracket = createToken({ name: "RBracket", pattern: /\>/ });
const Pipe = createToken({ name: "Pipe", pattern: /\|/ });
const SemiColon = createToken({ name: "SemiColon", pattern: /\;/ });
const Colon = createToken({ name: "Colon", pattern: /\:/ });
const Plus = createToken({ name: "Plus", pattern: /\+/, categories: [Binop] });
const Minus = createToken({
  name: "Minus",
  pattern: /\-/,
  categories: [Unop, Binop],
});
const Times = createToken({
  name: "Times",
  pattern: /\*/,
  categories: [Binop],
});
const Division = createToken({
  name: "Division",
  pattern: /\//,
  categories: [Binop],
});
const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /\s+/,
  group: Lexer.SKIPPED,
});

export const tokens = [
  If,
  Else,
  While,
  For,
  Return,
  Continue,
  Break,
  And,
  Or,
  Not,
  Eq,
  Ne,
  Gte,
  Gt,
  Lte,
  Lt,
  LCurly,
  RCurly,
  LParen,
  Equals,
  RParen,
  LBracket,
  RBracket,
  Pipe,
  SemiColon,
  Colon,
  Plus,
  Minus,
  Times,
  Division,
  WhiteSpace,
  Identifier,
  StringLiteral,
  Integer,
];
