import type {
  CstNode,
  ICstVisitor,
  IToken,
} from "https://esm.sh/chevrotain@10.4.1";

export interface TopRuleCstNode extends CstNode {
  name: "topRule";
  children: TopRuleCstChildren;
}

export type TopRuleCstChildren = {
  statement?: StatementCstNode[];
};

export interface StatementCstNode extends CstNode {
  name: "statement";
  children: StatementCstChildren;
}

export type StatementCstChildren = {
  emptyStatement?: EmptyStatementCstNode[];
  ifStatement?: IfStatementCstNode[];
  whileStatement?: WhileStatementCstNode[];
  doUntilStatement?: DoUntilStatementCstNode[];
  forStatement?: ForStatementCstNode[];
  functionStatement?: FunctionStatementCstNode[];
  blockStatement?: BlockStatementCstNode[];
  variableStatement?: VariableStatementCstNode[];
  breakStatement?: BreakStatementCstNode[];
  continueStatement?: ContinueStatementCstNode[];
  returnStatement?: ReturnStatementCstNode[];
  callStatement?: CallStatementCstNode[];
  typeStatement?: TypeStatementCstNode[];
};

export interface EmptyStatementCstNode extends CstNode {
  name: "emptyStatement";
  children: EmptyStatementCstChildren;
}

export type EmptyStatementCstChildren = {
  SemiColon: IToken[];
};

export interface VariableStatementCstNode extends CstNode {
  name: "variableStatement";
  children: VariableStatementCstChildren;
}

export type VariableStatementCstChildren = {
  LAngleBracket: IToken[];
  Identifier: IToken[];
  Colon?: IToken[];
  RAngleBracket: IToken[];
  Equals: IToken[];
  expression: ExpressionCstNode[];
  SemiColon: IToken[];
};

export interface BlockStatementCstNode extends CstNode {
  name: "blockStatement";
  children: BlockStatementCstChildren;
}

export type BlockStatementCstChildren = {
  LCurly: IToken[];
  topRule: TopRuleCstNode[];
  RCurly: IToken[];
};

export interface IfStatementCstNode extends CstNode {
  name: "ifStatement";
  children: IfStatementCstChildren;
}

export type IfStatementCstChildren = {
  If: IToken[];
  parenExpression: ParenExpressionCstNode[];
  statement: StatementCstNode[];
  Elseif?: IToken[];
  Else?: IToken[];
};

export interface WhileStatementCstNode extends CstNode {
  name: "whileStatement";
  children: WhileStatementCstChildren;
}

export type WhileStatementCstChildren = {
  While: IToken[];
  parenExpression: ParenExpressionCstNode[];
  statement: StatementCstNode[];
};

export interface DoUntilStatementCstNode extends CstNode {
  name: "doUntilStatement";
  children: DoUntilStatementCstChildren;
}

export type DoUntilStatementCstChildren = {
  Do: IToken[];
  statement: StatementCstNode[];
  Until: IToken[];
  parenExpression: ParenExpressionCstNode[];
  SemiColon: IToken[];
};

export interface ForStatementCstNode extends CstNode {
  name: "forStatement";
  children: ForStatementCstChildren;
}

export type ForStatementCstChildren = {
  For: IToken[];
  LParen: IToken[];
  Identifier: IToken[];
  Equals: IToken[];
  expression: ExpressionCstNode[];
  SemiColon: IToken[];
  RParen: IToken[];
  blockStatement: BlockStatementCstNode[];
};

export interface FunctionStatementCstNode extends CstNode {
  name: "functionStatement";
  children: FunctionStatementCstChildren;
}

export type FunctionStatementCstChildren = {
  LAngleBracket: IToken[];
  Identifier: IToken[];
  funcargsDefinition: FuncargsDefinitionCstNode[];
  Colon?: IToken[];
  RAngleBracket: IToken[];
  blockStatement: BlockStatementCstNode[];
};

export interface FuncargsDefinitionCstNode extends CstNode {
  name: "funcargsDefinition";
  children: FuncargsDefinitionCstChildren;
}

export type FuncargsDefinitionCstChildren = {
  LParen: IToken[];
  funcargDefinition?: FuncargDefinitionCstNode[];
  Comma?: IToken[];
  RParen: IToken[];
};

export interface FuncargDefinitionCstNode extends CstNode {
  name: "funcargDefinition";
  children: FuncargDefinitionCstChildren;
}

export type FuncargDefinitionCstChildren = {
  Identifier: IToken[];
  Colon?: IToken[];
};

export interface BreakStatementCstNode extends CstNode {
  name: "breakStatement";
  children: BreakStatementCstChildren;
}

export type BreakStatementCstChildren = {
  Break: IToken[];
  SemiColon: IToken[];
};

export interface ContinueStatementCstNode extends CstNode {
  name: "continueStatement";
  children: ContinueStatementCstChildren;
}

export type ContinueStatementCstChildren = {
  Continue: IToken[];
  SemiColon: IToken[];
};

export interface ReturnStatementCstNode extends CstNode {
  name: "returnStatement";
  children: ReturnStatementCstChildren;
}

export type ReturnStatementCstChildren = {
  Return: IToken[];
  expression?: ExpressionCstNode[];
  parenExpression?: ParenExpressionCstNode[];
  SemiColon: IToken[];
};

export interface TypeStatementCstNode extends CstNode {
  name: "typeStatement";
  children: TypeStatementCstChildren;
}

export type TypeStatementCstChildren = {
  LAngleBracket: IToken[];
  Identifier: IToken[];
  RAngleBracket: IToken[];
  LCurly: IToken[];
  Colon: IToken[];
  SemiColon: IToken[];
  RCurly: IToken[];
};

export interface CallStatementCstNode extends CstNode {
  name: "callStatement";
  children: CallStatementCstChildren;
}

export type CallStatementCstChildren = {
  callExpression: CallExpressionCstNode[];
  SemiColon: IToken[];
};

export interface CallExpressionCstNode extends CstNode {
  name: "callExpression";
  children: CallExpressionCstChildren;
}

export type CallExpressionCstChildren = {
  Identifier: IToken[];
  Minus: IToken[];
  RAngleBracket: IToken[];
  funcargs: FuncargsCstNode[];
};

export interface FuncargsCstNode extends CstNode {
  name: "funcargs";
  children: FuncargsCstChildren;
}

export type FuncargsCstChildren = {
  LParen: IToken[];
  expression?: ExpressionCstNode[];
  Comma?: IToken[];
  RParen: IToken[];
};

export interface ParenExpressionCstNode extends CstNode {
  name: "parenExpression";
  children: ParenExpressionCstChildren;
}

export type ParenExpressionCstChildren = {
  LParen: IToken[];
  expression: ExpressionCstNode[];
  RParen: IToken[];
};

export interface ExpressionCstNode extends CstNode {
  name: "expression";
  children: ExpressionCstChildren;
}

export type ExpressionCstChildren = {
  equalty: EqualtyCstNode[];
  LogicalBinop?: IToken[];
};

export interface EqualtyCstNode extends CstNode {
  name: "equalty";
  children: EqualtyCstChildren;
}

export type EqualtyCstChildren = {
  comparison: ComparisonCstNode[];
  EqualtyBinop?: IToken[];
};

export interface ComparisonCstNode extends CstNode {
  name: "comparison";
  children: ComparisonCstChildren;
}

export type ComparisonCstChildren = {
  term: TermCstNode[];
  ComparisonBinop?: IToken[];
};

export interface TermCstNode extends CstNode {
  name: "term";
  children: TermCstChildren;
}

export type TermCstChildren = {
  factor: FactorCstNode[];
  TermBinop?: IToken[];
};

export interface FactorCstNode extends CstNode {
  name: "factor";
  children: FactorCstChildren;
}

export type FactorCstChildren = {
  unary: UnaryCstNode[];
  FactorBinop?: IToken[];
};

export interface UnaryCstNode extends CstNode {
  name: "unary";
  children: UnaryCstChildren;
}

export type UnaryCstChildren = {
  simpleExpression?: SimpleExpressionCstNode[];
  Unop?: IToken[];
  unary?: UnaryCstNode[];
};

export interface SimpleExpressionCstNode extends CstNode {
  name: "simpleExpression";
  children: SimpleExpressionCstChildren;
}

export type SimpleExpressionCstChildren = {
  callExpression?: CallExpressionCstNode[];
  dictionary?: DictionaryCstNode[];
  array?: ArrayCstNode[];
  Integer?: IToken[];
  StringLiteral?: IToken[];
  Identifier?: IToken[];
  True?: IToken[];
  False?: IToken[];
};

export interface ArrayCstNode extends CstNode {
  name: "array";
  children: ArrayCstChildren;
}

export type ArrayCstChildren = {
  LBracket: IToken[];
  expression?: ExpressionCstNode[];
  Comma?: IToken[];
  RBracket: IToken[];
};

export interface DictionaryCstNode extends CstNode {
  name: "dictionary";
  children: DictionaryCstChildren;
}

export type DictionaryCstChildren = {
  LCurly: IToken[];
  Identifier?: IToken[];
  Colon?: IToken[];
  expression?: ExpressionCstNode[];
  Comma?: IToken[];
  RCurly: IToken[];
};

export interface ICstNodeVisitor<IN, OUT> extends ICstVisitor<IN, OUT> {
  topRule(children: TopRuleCstChildren, param?: IN): OUT;
  statement(children: StatementCstChildren, param?: IN): OUT;
  emptyStatement(children: EmptyStatementCstChildren, param?: IN): OUT;
  variableStatement(children: VariableStatementCstChildren, param?: IN): OUT;
  blockStatement(children: BlockStatementCstChildren, param?: IN): OUT;
  ifStatement(children: IfStatementCstChildren, param?: IN): OUT;
  whileStatement(children: WhileStatementCstChildren, param?: IN): OUT;
  doUntilStatement(children: DoUntilStatementCstChildren, param?: IN): OUT;
  forStatement(children: ForStatementCstChildren, param?: IN): OUT;
  functionStatement(children: FunctionStatementCstChildren, param?: IN): OUT;
  funcargsDefinition(children: FuncargsDefinitionCstChildren, param?: IN): OUT;
  funcargDefinition(children: FuncargDefinitionCstChildren, param?: IN): OUT;
  breakStatement(children: BreakStatementCstChildren, param?: IN): OUT;
  continueStatement(children: ContinueStatementCstChildren, param?: IN): OUT;
  returnStatement(children: ReturnStatementCstChildren, param?: IN): OUT;
  typeStatement(children: TypeStatementCstChildren, param?: IN): OUT;
  callStatement(children: CallStatementCstChildren, param?: IN): OUT;
  callExpression(children: CallExpressionCstChildren, param?: IN): OUT;
  funcargs(children: FuncargsCstChildren, param?: IN): OUT;
  parenExpression(children: ParenExpressionCstChildren, param?: IN): OUT;
  expression(children: ExpressionCstChildren, param?: IN): OUT;
  equalty(children: EqualtyCstChildren, param?: IN): OUT;
  comparison(children: ComparisonCstChildren, param?: IN): OUT;
  term(children: TermCstChildren, param?: IN): OUT;
  factor(children: FactorCstChildren, param?: IN): OUT;
  unary(children: UnaryCstChildren, param?: IN): OUT;
  simpleExpression(children: SimpleExpressionCstChildren, param?: IN): OUT;
  array(children: ArrayCstChildren, param?: IN): OUT;
  dictionary(children: DictionaryCstChildren, param?: IN): OUT;
}
