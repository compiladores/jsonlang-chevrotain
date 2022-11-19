// deno-lint-ignore-file no-explicit-any
import { parser } from "../parser/index.ts";
import {
  BlockStatementCstChildren,
  BreakStatementCstChildren,
  CallStatementCstChildren,
  ContinueStatementCstChildren,
  DoUntilStatementCstChildren,
  EmptyStatementCstChildren,
  ExpressionCstChildren,
  ExpressionListCstChildren,
  ForStatementCstChildren,
  FunctionStatementCstChildren,
  IfStatementCstChildren,
  ParenExpressionCstChildren,
  ReturnStatementCstChildren,
  StatementCstChildren,
  TopRuleCstChildren,
  VariableStatementCstChildren,
  WhileStatementCstChildren,
} from "./compilang_cst.d.ts";

const BaseCSTVisitor = parser.getBaseCstVisitorConstructorWithDefaults();

class CompilangCSTVisitor extends BaseCSTVisitor {
  constructor() {
    super();
    this.validateVisitor();
  }

  topRule(ctx: TopRuleCstChildren) {
    if (!ctx.statement) return [];
    const res = [];
    for (const node of ctx.statement) {
      res.push(this.visit(node));
    }
    return res;
  }

  statement(ctx: StatementCstChildren) {
    if (ctx.emptyStatement) return this.visit(ctx.emptyStatement);
    if (ctx.variableStatement) return this.visit(ctx.variableStatement);
    if (ctx.breakStatement) return this.visit(ctx.breakStatement);
    if (ctx.continueStatement) return this.visit(ctx.continueStatement);
    if (ctx.blockStatement) return this.visit(ctx.blockStatement);
    if (ctx.ifStatement) return this.visit(ctx.ifStatement);
    if (ctx.whileStatement) return this.visit(ctx.whileStatement);
    if (ctx.doUntilStatement) return this.visit(ctx.doUntilStatement);
    if (ctx.forStatement) return this.visit(ctx.forStatement);
    if (ctx.callStatement) return this.visit(ctx.callStatement);
    if (ctx.returnStatement) return this.visit(ctx.returnStatement);
    if (ctx.functionStatement) return this.visit(ctx.functionStatement);
  }

  ifStatement(ctx: IfStatementCstChildren) {
    const res: any = { if: [] };
    const statements = ctx.statement.map((stmt) => this.visit(stmt));
    const expressions = ctx.parenExpression.map((expr) => this.visit(expr));
    for (let i = 0; i < expressions.length; i++) {
      res.if.push({
        cond: expressions[i],
        then: statements[i],
      });
    }
    if (ctx.Else) {
      res.else = statements[statements.length - 1];
    }
    return res;
  }

  whileStatement(ctx: WhileStatementCstChildren) {
    return {
      while: this.visit(ctx.parenExpression),
      do: this.visit(ctx.statement),
    };
  }

  doUntilStatement(ctx: DoUntilStatementCstChildren) {
    return {
      do: this.visit(ctx.statement),
      until: this.visit(ctx.parenExpression),
    };
  }

  forStatement(ctx: ForStatementCstChildren) {
    const expressions = ctx.expression.map((expr) => this.visit(expr));
    const res: any = {
      iterator: ctx.Identifier[0].image,
      from: expressions[0],
      to: expressions[1],
      do: this.visit(ctx.blockStatement),
    };
    if (expressions[2]) res.step = expressions[2];
    return res;
  }

  callStatement(ctx: CallStatementCstChildren) {
    const args = ctx.expressionList.flatMap((arg) => this.visit(arg));
    return {
      call: ctx.Identifier[0].image,
      args,
    };
  }

  variableStatement(ctx: VariableStatementCstChildren) {
    return { set: ctx.Identifier[0].image, value: this.visit(ctx.expression) };
  }

  returnStatement(ctx: ReturnStatementCstChildren) {
    if (ctx.expression) return { return: this.visit(ctx.expression) };
    if (ctx.parenExpression) return { return: this.visit(ctx.parenExpression) };
  }

  functionStatement(ctx: FunctionStatementCstChildren) {
    const args = ctx.Identifier.map((identifier) => identifier.image);
    const functionName = args.shift();
    return {
      function: functionName,
      args,
      block: this.visit(ctx.blockStatement),
    };
  }

  blockStatement(ctx: BlockStatementCstChildren) {
    return this.visit(ctx.topRule);
  }

  emptyStatement(_: EmptyStatementCstChildren) {
    return "noop";
  }

  breakStatement(_: BreakStatementCstChildren) {
    return "break";
  }

  continueStatement(_: ContinueStatementCstChildren) {
    return "continue";
  }

  expressionList(ctx: ExpressionListCstChildren) {
    if (!ctx.expression) return [];
    return ctx.expression.map((expr) => this.visit(expr));
  }

  parenExpression(ctx: ParenExpressionCstChildren) {
    return this.visit(ctx.expression);
  }

  expression(ctx: ExpressionCstChildren) {
    //TODO: terminar cuando este la expression
    return +ctx.Integer[0].image;
  }
}

export const CSTVisitor = new CompilangCSTVisitor();
