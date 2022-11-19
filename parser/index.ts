import { CstParser, Rule } from "https://esm.sh/chevrotain@10.4.1";
import {
  Break,
  Comma,
  Continue,
  Do,
  Else,
  Elseif,
  Equals,
  For,
  Identifier,
  If,
  Integer,
  LBracket,
  LCurly,
  LParen,
  Minus,
  RBracket,
  RCurly,
  Return,
  RParen,
  SemiColon,
  tokens,
  Until,
  While,
} from "../lexer/tokens.ts";

//TODO
/**
 * Expression
 * Call as expression
 */

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
    this.CONSUME(LBracket);
    this.CONSUME(Identifier);
    this.CONSUME(RBracket);
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
    this.CONSUME(LBracket);
    this.CONSUME(Identifier);
    this.CONSUME(LParen);
    this.MANY_SEP({
      SEP: Comma,
      DEF: () => this.CONSUME2(Identifier),
    });
    this.CONSUME(RParen);
    this.CONSUME(RBracket);
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
    this.CONSUME(Identifier);
    this.CONSUME(Minus);
    this.CONSUME(RBracket);
    this.SUBRULE(this.expressionList);
    this.CONSUME(SemiColon);
  });

  expressionList = this.RULE("expressionList", () => {
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
    //TODO: complete expression
    this.CONSUME(Integer);
  });
}

export const parser = new CompilangParser();
export const productions: Record<string, Rule> = parser.getGAstProductions();
