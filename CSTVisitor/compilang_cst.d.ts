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
  LBracket: IToken[];
  Identifier: IToken[];
  RBracket: IToken[];
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
  LBracket: IToken[];
  Identifier: IToken[];
  LParen: IToken[];
  Comma?: IToken[];
  RParen: IToken[];
  RBracket: IToken[];
  blockStatement: BlockStatementCstNode[];
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

export interface CallStatementCstNode extends CstNode {
  name: "callStatement";
  children: CallStatementCstChildren;
}

export type CallStatementCstChildren = {
  Identifier: IToken[];
  Minus: IToken[];
  RBracket: IToken[];
  expressionList: ExpressionListCstNode[];
  SemiColon: IToken[];
};

export interface ExpressionListCstNode extends CstNode {
  name: "expressionList";
  children: ExpressionListCstChildren;
}

export type ExpressionListCstChildren = {
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
  Integer: IToken[];
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
  breakStatement(children: BreakStatementCstChildren, param?: IN): OUT;
  continueStatement(children: ContinueStatementCstChildren, param?: IN): OUT;
  returnStatement(children: ReturnStatementCstChildren, param?: IN): OUT;
  callStatement(children: CallStatementCstChildren, param?: IN): OUT;
  expressionList(children: ExpressionListCstChildren, param?: IN): OUT;
  parenExpression(children: ParenExpressionCstChildren, param?: IN): OUT;
  expression(children: ExpressionCstChildren, param?: IN): OUT;
}
