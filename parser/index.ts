import { CstParser, Rule } from "https://esm.sh/chevrotain@10.4.1";
import {
  ComparisonBinop,
  EqualtyBinop,
  FactorBinop,
  LogicalBinop,
  TermBinop,
  Unop,
} from "../lexer/categories.ts";
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
  Period,
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

// equality → comparison ( ( "!=" | "==" ) comparison )* ;
// comparison → term ( ( ">" | ">=" | "<" | "<=" ) term )* ;
// term → factor ( ( "-" | "+" ) factor )* ;
// factor → unary ( ( "/" | "*" ) unary )* ;
// unary→ ( "!" | "-" ) unary;
// primary -> simpleexpr

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
      { ALT: () => this.SUBRULE(this.assignmentStatement) },
      { ALT: () => this.SUBRULE(this.breakStatement) },
      { ALT: () => this.SUBRULE(this.continueStatement) },
      { ALT: () => this.SUBRULE(this.returnStatement) },
      { ALT: () => this.SUBRULE(this.callStatement) },
      { ALT: () => this.SUBRULE(this.typeStatement) },
    ]);
  });

  emptyStatement = this.RULE("emptyStatement", () => {
    this.CONSUME(SemiColon);
  });

  variableStatement = this.RULE("variableStatement", () => {
    this.CONSUME(LAngleBracket);
    this.CONSUME(Identifier);
    this.OPTION(() => {
      this.CONSUME(Colon);
      this.CONSUME2(Identifier);
    });
    this.CONSUME(RAngleBracket);
    this.CONSUME(Equals);
    this.SUBRULE(this.expression);
    this.CONSUME(SemiColon);
  });

  assignmentStatement = this.RULE("assignmentStatement", () => {
    this.CONSUME(LAngleBracket);
    this.CONSUME(Identifier);
    this.CONSUME(LBracket);
    this.SUBRULE(this.expression);
    this.CONSUME(RBracket);
    this.CONSUME(RAngleBracket);
    this.CONSUME(Equals);
    this.SUBRULE2(this.expression);
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
    this.SUBRULE(this.funcargsDefinition);
    this.OPTION(() => {
      this.CONSUME(Colon);
      this.CONSUME2(Identifier);
    });
    this.CONSUME(RAngleBracket);
    this.SUBRULE(this.blockStatement);
  });

  funcargsDefinition = this.RULE("funcargsDefinition", () => {
    this.CONSUME(LParen);
    this.MANY_SEP({
      SEP: Comma,
      DEF: () => this.SUBRULE(this.funcargDefinition),
    });
    this.CONSUME(RParen);
  });

  funcargDefinition = this.RULE("funcargDefinition", () => {
    this.CONSUME(Identifier);
    this.OPTION(() => {
      this.CONSUME(Colon);
      this.CONSUME2(Identifier);
    });
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

  typeStatement = this.RULE("typeStatement", () => {
    this.CONSUME(LAngleBracket);
    this.CONSUME2(LAngleBracket);
    this.CONSUME(Identifier);
    this.CONSUME(RAngleBracket);
    this.CONSUME2(RAngleBracket);
    this.CONSUME(LCurly);
    this.AT_LEAST_ONE(() => {
      this.CONSUME2(Identifier);
      this.CONSUME(Colon);
      this.CONSUME3(Identifier);
      this.CONSUME(SemiColon);
    });
    this.CONSUME(RCurly);
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
    this.OPTION(() => {
      this.SUBRULE(this.method);
    });
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
    this.SUBRULE(this.equalty);
    this.MANY(() => {
      this.CONSUME(LogicalBinop);
      this.SUBRULE2(this.equalty);
    });
  });

  equalty = this.RULE("equalty", () => {
    this.SUBRULE(this.comparison);
    this.MANY(() => {
      this.CONSUME(EqualtyBinop);
      this.SUBRULE2(this.comparison);
    });
  });

  comparison = this.RULE("comparison", () => {
    this.SUBRULE(this.term);
    this.MANY(() => {
      this.CONSUME(ComparisonBinop);
      this.SUBRULE2(this.term);
    });
  });

  term = this.RULE("term", () => {
    this.SUBRULE(this.factor);
    this.MANY(() => {
      this.CONSUME(TermBinop);
      this.SUBRULE2(this.factor);
    });
  });

  factor = this.RULE("factor", () => {
    this.SUBRULE(this.unary);
    this.MANY(() => {
      this.CONSUME(FactorBinop);
      this.SUBRULE2(this.unary);
    });
  });

  unary = this.RULE("unary", () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.simpleExpression) },
      {
        ALT: () => {
          this.CONSUME(Unop);
          this.SUBRULE(this.unary);
        },
      },
    ]);
  });

  simpleExpression = this.RULE("simpleExpression", () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.callExpression) },
      { ALT: () => this.SUBRULE(this.dictionary) },
      { ALT: () => this.SUBRULE(this.array) },
      { ALT: () => this.SUBRULE(this.accesor) },
      { ALT: () => this.CONSUME(Integer) },
      { ALT: () => this.SUBRULE(this.string) },
      { ALT: () => this.SUBRULE(this.variable) },
      { ALT: () => this.CONSUME(True) },
      { ALT: () => this.CONSUME(False) },
    ]);
  });

  accesor = this.RULE("accesor", () => {
    this.CONSUME(Identifier);
    this.CONSUME(LBracket);
    this.SUBRULE(this.expression);
    this.CONSUME(RBracket);
  });

  method = this.RULE("method", () => {
    this.CONSUME(Period);
    this.CONSUME2(Identifier);
    this.CONSUME(Minus);
    this.CONSUME(RAngleBracket);
    this.SUBRULE(this.funcargs);
  });

  string = this.RULE("string", () => {
    this.CONSUME(StringLiteral);
    this.OPTION(() => {
      this.SUBRULE(this.method);
    });
  });

  variable = this.RULE("variable", () => {
    this.CONSUME(Identifier);
    this.OPTION(() => {
      this.SUBRULE(this.method);
    });
  });

  array = this.RULE("array", () => {
    this.CONSUME(LBracket);
    this.MANY_SEP({
      SEP: Comma,
      DEF: () => this.SUBRULE(this.expression),
    });
    this.CONSUME(RBracket);
    this.OPTION(() => {
      this.SUBRULE(this.method);
    });
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
    this.OPTION(() => {
      this.SUBRULE(this.method);
    });
  });
}

export const parser = new CompilangParser();
export const productions: Record<string, Rule> = parser.getGAstProductions();
