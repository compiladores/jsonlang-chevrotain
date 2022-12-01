// deno-lint-ignore-file no-explicit-any
import { parser } from "../parser/index.ts";
import {
  ArrayCstChildren,
  BlockStatementCstChildren,
  BreakStatementCstChildren,
  CallExpressionCstChildren,
  CallStatementCstChildren,
  ComparisonCstChildren,
  ContinueStatementCstChildren,
  DictionaryCstChildren,
  DoUntilStatementCstChildren,
  EmptyStatementCstChildren,
  EqualtyCstChildren,
  ExpressionCstChildren,
  FactorCstChildren,
  ForStatementCstChildren,
  FuncargsCstChildren,
  FunctionStatementCstChildren,
  IfStatementCstChildren,
  ParenExpressionCstChildren,
  ReturnStatementCstChildren,
  SimpleExpressionCstChildren,
  StatementCstChildren,
  TermCstChildren,
  TopRuleCstChildren,
  UnaryCstChildren,
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
    return this.visit(ctx.callExpression);
  }

  callExpression(ctx: CallExpressionCstChildren) {
    const args = ctx.funcargs.flatMap((arg) => this.visit(arg));
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
    console.log("asd");
    return "break";
  }

  continueStatement(_: ContinueStatementCstChildren) {
    return "continue";
  }

  funcargs(ctx: FuncargsCstChildren) {
    if (!ctx.expression) return [];
    return ctx.expression.map((expr) => this.visit(expr));
  }

  parenExpression(ctx: ParenExpressionCstChildren) {
    return this.visit(ctx.expression);
  }

  expression(ctx: ExpressionCstChildren) {
    const equalties = ctx.equalty.map((eq) => this.visit(eq));
    if (ctx.LogicalBinop) {
      const binops = ctx.LogicalBinop;
      return equalties.reduce((a, b, index) => ({
        binop: binops[index - 1].image,
        argl: a,
        argr: b,
      }));
    } else {
      return equalties[0];
    }
  }

  equalty(ctx: EqualtyCstChildren) {
    const comparisons = ctx.comparison.map((cmp) => this.visit(cmp));
    if (ctx.EqualtyBinop) {
      const binops = ctx.EqualtyBinop;
      return comparisons.reduce((a, b, index) => ({
        binop: binops[index - 1].image,
        argl: a,
        argr: b,
      }));
    } else {
      return comparisons[0];
    }
  }

  comparison(ctx: ComparisonCstChildren) {
    const terms = ctx.term.map((term) => this.visit(term));
    if (ctx.ComparisonBinop) {
      const binops = ctx.ComparisonBinop;
      return terms.reduce((a, b, index) => ({
        binop: binops[index - 1].image,
        argl: a,
        argr: b,
      }));
    } else {
      return terms[0];
    }
  }

  term(ctx: TermCstChildren) {
    const factors = ctx.factor.map((fct) => this.visit(fct));
    if (ctx.TermBinop) {
      const binops = ctx.TermBinop;
      return factors.reduce((a, b, index) => ({
        binop: binops[index - 1].image,
        argl: a,
        argr: b,
      }));
    } else {
      return factors[0];
    }
  }

  factor(ctx: FactorCstChildren) {
    const unaries = ctx.unary.map((un) => this.visit(un));
    if (ctx.FactorBinop) {
      const binops = ctx.FactorBinop;
      return unaries.reduce((a, b, index) => ({
        binop: binops[index - 1].image,
        argl: a,
        argr: b,
      }));
    } else {
      return unaries[0];
    }
  }

  unary(ctx: UnaryCstChildren) {
    if (ctx.simpleExpression) return this.visit(ctx.simpleExpression);
    if (ctx.Unop && ctx.unary) {
      return { unop: ctx.Unop[0].image, arg: this.visit(ctx.unary) };
    }
  }

  simpleExpression(ctx: SimpleExpressionCstChildren) {
    if (ctx.Integer) return +ctx.Integer[0].image;
    if (ctx.False) return false;
    if (ctx.True) return true;
    if (ctx.Identifier) return ctx.Identifier[0].image;
    if (ctx.StringLiteral)
      return ctx.StringLiteral[0].image.replace(/^"(.*)"$/, "$1");
    if (ctx.array) return this.visit(ctx.array);
    if (ctx.dictionary) return this.visit(ctx.dictionary);
    if (ctx.callExpression) return this.visit(ctx.callExpression);
  }

  array(ctx: ArrayCstChildren) {
    if (!ctx.expression) return [];
    return ctx.expression.map((expr) => this.visit(expr));
  }

  dictionary(ctx: DictionaryCstChildren) {
    const retVal: any = { dict: [] };
    if (!ctx.Identifier || !ctx.expression) return retVal;
    for (let i = 0; i < ctx.Identifier.length; i++) {
      const key = ctx.Identifier[i].image;
      const value = this.visit(ctx.expression[i]);
      retVal.dict.push({ [key]: value });
    }
    return retVal;
  }
}

export const CSTVisitor = new CompilangCSTVisitor();
