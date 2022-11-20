import { CstParser, Rule } from "https://esm.sh/chevrotain@10.4.1";
import { Binop, Unop } from "../lexer/categories.ts";
import {
  Break,
  Colon,
  Comma,
  Continue,
  Do,
  Else,
  Elseif,
  Equals,
  False,
  For,
  Identifier,
  If,
  Integer,
  LAngleBracket,
  LBracket,
  LCurly,
  LParen,
  Minus,
  RAngleBracket,
  RBracket,
  RCurly,
  Return,
  RParen,
  SemiColon,
  StringLiteral,
  tokens,
  True,
  Until,
  While,
} from "../lexer/tokens.ts";

class CompilangParser extends CstParser {
  constructor() {
    super(tokens);
    this.performSelfAnalysis();
  }

  topRule = this.RULE("topRule", () => {
    this.MANY(() => {
      this.SUBRULE(this.statement);
    });
  });

  statement = this.RULE("statement", () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.emptyStatement) },
      { ALT: () => this.SUBRULE(this.ifStatement) },
      { ALT: () => this.SUBRULE(this.whileStatement) },
      { ALT: () => this.SUBRULE(this.doUntilStatement) },
      { ALT: () => this.SUBRULE(this.forStatement) },
      { ALT: () => this.SUBRULE(this.functionStatement) },
      { ALT: () => this.SUBRULE(this.blockStatement) },
      { ALT: () => this.SUBRULE(this.variableStatement) },
      { ALT: () => this.SUBRULE(this.breakStatement) },
      { ALT: () => this.SUBRULE(this.continueStatement) },
      { ALT: () => this.SUBRULE(this.returnStatement) },
      { ALT: () => this.SUBRULE(this.callStatement) },
    ]);
  });

  emptyStatement = this.RULE("emptyStatement", () => {
    this.CONSUME(SemiColon);
  });

  variableStatement = this.RULE("variableStatement", () => {
    this.CONSUME(LAngleBracket);
    this.CONSUME(Identifier);
    this.CONSUME(RAngleBracket);
    this.CONSUME(Equals);
    this.SUBRULE(this.expression);
    this.CONSUME(SemiColon);
  });

  blockStatement = this.RULE("blockStatement", () => {
    this.CONSUME(LCurly);
    this.SUBRULE(this.topRule);
    this.CONSUME(RCurly);
  });

  ifStatement = this.RULE("ifStatement", () => {
    this.CONSUME(If);
    this.SUBRULE(this.parenExpression);
    this.SUBRULE(this.statement);
    this.MANY(() => {
      this.CONSUME(Elseif);
      this.SUBRULE2(this.parenExpression);
      this.SUBRULE2(this.statement);
    });
    this.OPTION(() => {
      this.CONSUME(Else);
      this.SUBRULE3(this.statement);
    });
  });

  whileStatement = this.RULE("whileStatement", () => {
    this.CONSUME(While);
    this.SUBRULE(this.parenExpression);
    this.SUBRULE(this.statement);
  });

  doUntilStatement = this.RULE("doUntilStatement", () => {
    this.CONSUME(Do);
    this.SUBRULE(this.statement);
    this.CONSUME(Until);
    this.SUBRULE(this.parenExpression);
    this.CONSUME(SemiColon);
  });

  forStatement = this.RULE("forStatement", () => {
    this.CONSUME(For);
    this.CONSUME(LParen);
    this.CONSUME(Identifier);
    this.CONSUME(Equals);
    this.SUBRULE(this.expression);
    this.CONSUME(SemiColon);
    this.SUBRULE2(this.expression);
    this.CONSUME2(SemiColon);
    this.OPTION(() => {
      this.SUBRULE3(this.expression);
    });
    this.CONSUME(RParen);
    this.SUBRULE(this.blockStatement);
  });

  functionStatement = this.RULE("functionStatement", () => {
    this.CONSUME(LAngleBracket);
    this.CONSUME(Identifier);
    this.CONSUME(LParen);
    this.MANY_SEP({
      SEP: Comma,
      DEF: () => this.CONSUME2(Identifier),
    });
    this.CONSUME(RParen);
    this.CONSUME(RAngleBracket);
    this.SUBRULE(this.blockStatement);
  });

  breakStatement = this.RULE("breakStatement", () => {
    this.CONSUME(Break);
    this.CONSUME(SemiColon);
  });

  continueStatement = this.RULE("continueStatement", () => {
    this.CONSUME(Continue);
    this.CONSUME(SemiColon);
  });

  returnStatement = this.RULE("returnStatement", () => {
    this.CONSUME(Return);
    this.OPTION(() => {
      this.OR([
        { ALT: () => this.SUBRULE(this.expression) },
        { ALT: () => this.SUBRULE(this.parenExpression) },
      ]);
    });
    this.CONSUME(SemiColon);
  });

  callStatement = this.RULE("callStatement", () => {
    this.SUBRULE(this.callExpression);
    this.CONSUME(SemiColon);
  });

  callExpression = this.RULE("callExpression", () => {
    this.CONSUME(Identifier);
    this.CONSUME(Minus);
    this.CONSUME(RAngleBracket);
    this.SUBRULE(this.funcargs);
  });

  funcargs = this.RULE("funcargs", () => {
    this.CONSUME(LParen);
    this.MANY_SEP({
      SEP: Comma,
      DEF: () => this.SUBRULE(this.expression),
    });
    this.CONSUME(RParen);
  });

  parenExpression = this.RULE("parenExpression", () => {
    this.CONSUME(LParen);
    this.SUBRULE(this.expression);
    this.CONSUME(RParen);
  });

  expression = this.RULE("expression", () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.simpleExpression) },
      {
        ALT: () => {
          this.CONSUME(Unop);
          this.SUBRULE(this.expression);
        },
      },
    ]);
    this.MANY(() => {
      this.CONSUME(Binop);
      this.SUBRULE2(this.expression);
    });
  });

  simpleExpression = this.RULE("simpleExpression", () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.callExpression) },
      { ALT: () => this.SUBRULE(this.dictionary) },
      { ALT: () => this.SUBRULE(this.array) },
      { ALT: () => this.CONSUME(Integer) },
      { ALT: () => this.CONSUME(StringLiteral) },
      { ALT: () => this.CONSUME(Identifier) },
      { ALT: () => this.CONSUME(True) },
      { ALT: () => this.CONSUME(False) },
      //TODO: paren expression -> (1 + (3 - (x)))
    ]);
  });

  array = this.RULE("array", () => {
    this.CONSUME(LBracket);
    this.MANY_SEP({
      SEP: Comma,
      DEF: () => this.SUBRULE(this.expression),
    });
    this.CONSUME(RBracket);
  });

  dictionary = this.RULE("dictionary", () => {
    this.CONSUME(LCurly);
    this.MANY_SEP({
      SEP: Comma,
      DEF: () => {
        this.CONSUME(Identifier);
        this.CONSUME(Colon);
        this.SUBRULE(this.expression);
      },
    });
    this.CONSUME(RCurly);
  });
}

export const parser = new CompilangParser();
export const productions: Record<string, Rule> = parser.getGAstProductions();
