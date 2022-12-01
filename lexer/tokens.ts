import { createToken, Lexer } from "https://esm.sh/chevrotain@10.4.1";
import {
  ComparisonBinop,
  EqualtyBinop,
  FactorBinop,
  LogicalBinop,
  TermBinop,
  Unop,
} from "./categories.ts";

export const Identifier = createToken({
  name: "Identifier",
  pattern: /[a-zA-Z]\w*/,
});
export const StringLiteral = createToken({
  name: "StringLiteral",
  pattern: /"(?:""|[^"])*"/,
});
export const Integer = createToken({ name: "Integer", pattern: /0|[1-9]\d*/ });
export const If = createToken({
  name: "If",
  pattern: /if/,
  longer_alt: Identifier,
});
export const Elseif = createToken({
  name: "Elseif",
  pattern: /elseif/,
  longer_alt: Identifier,
});
export const Else = createToken({
  name: "Else",
  pattern: /else/,
  longer_alt: Identifier,
});
export const While = createToken({
  name: "While",
  pattern: /while/,
  longer_alt: Identifier,
});
export const Do = createToken({
  name: "Do",
  pattern: /do/,
  longer_alt: Identifier,
});
export const Until = createToken({
  name: "Until",
  pattern: /until/,
  longer_alt: Identifier,
});
export const Return = createToken({
  name: "Return",
  pattern: /return/,
  longer_alt: Identifier,
});
export const Continue = createToken({
  name: "Continue",
  pattern: /continue/,
  longer_alt: Identifier,
});
export const Break = createToken({
  name: "Break",
  pattern: /break/,
  longer_alt: Identifier,
});
export const For = createToken({
  name: "For",
  pattern: /for/,
  longer_alt: Identifier,
});
export const And = createToken({
  name: "And",
  pattern: /and/,
  longer_alt: Identifier,
  categories: [LogicalBinop],
});
export const Or = createToken({
  name: "Or",
  pattern: /or/,
  longer_alt: Identifier,
  categories: [LogicalBinop],
});
export const Not = createToken({
  name: "Not",
  pattern: /not/,
  longer_alt: Identifier,
  categories: [Unop],
});
export const Eq = createToken({
  name: "Eq",
  pattern: /eq/,
  longer_alt: Identifier,
  categories: [EqualtyBinop],
});
export const Ne = createToken({
  name: "Ne",
  pattern: /ne/,
  longer_alt: Identifier,
  categories: [EqualtyBinop],
});
export const Gt = createToken({
  name: "Gt",
  pattern: /gt/,
  longer_alt: Identifier,
  categories: [ComparisonBinop],
});
export const Gte = createToken({
  name: "Gte",
  pattern: /gte/,
  longer_alt: Identifier,
  categories: [ComparisonBinop],
});
export const Lt = createToken({
  name: "Lt",
  pattern: /lt/,
  longer_alt: Identifier,
  categories: [ComparisonBinop],
});
export const Lte = createToken({
  name: "Lte",
  pattern: /lte/,
  longer_alt: Identifier,
  categories: [ComparisonBinop],
});
export const LCurly = createToken({ name: "LCurly", pattern: /\{/ });
export const RCurly = createToken({ name: "RCurly", pattern: /\}/ });
export const LParen = createToken({ name: "LParen", pattern: /\(/ });
export const RParen = createToken({ name: "RParen", pattern: /\)/ });
export const Equals = createToken({ name: "Equals", pattern: /\=/ });
export const LAngleBracket = createToken({
  name: "LAngleBracket",
  pattern: /\</,
});
export const RAngleBracket = createToken({
  name: "RAngleBracket",
  pattern: /\>/,
});
export const LBracket = createToken({ name: "LBracket", pattern: /\[/ });
export const RBracket = createToken({ name: "RBracket", pattern: /\]/ });
export const Pipe = createToken({ name: "Pipe", pattern: /\|/ });
export const SemiColon = createToken({ name: "SemiColon", pattern: /\;/ });
export const Colon = createToken({ name: "Colon", pattern: /\:/ });
export const Comma = createToken({ name: "Comma", pattern: /\,/ });
export const True = createToken({ name: "True", pattern: /true/ });
export const False = createToken({ name: "False", pattern: /false/ });
export const Plus = createToken({
  name: "Plus",
  pattern: /\+/,
  categories: [TermBinop],
});
export const Minus = createToken({
  name: "Minus",
  pattern: /\-/,
  categories: [Unop, TermBinop],
});
export const Times = createToken({
  name: "Times",
  pattern: /\*/,
  categories: [FactorBinop],
});
export const Division = createToken({
  name: "Division",
  pattern: /\//,
  categories: [FactorBinop],
});
export const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /\s+/,
  group: Lexer.SKIPPED,
});

export const tokens = [
  Unop,
  LogicalBinop,
  EqualtyBinop,
  ComparisonBinop,
  TermBinop,
  FactorBinop,
  If,
  Elseif,
  Else,
  While,
  Do,
  Until,
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
  LAngleBracket,
  RAngleBracket,
  Pipe,
  SemiColon,
  Colon,
  Comma,
  True,
  False,
  Plus,
  Minus,
  Times,
  Division,
  WhiteSpace,
  Identifier,
  StringLiteral,
  Integer,
];
