// deno-lint-ignore-file no-explicit-any
import {
  StatementCstChildren,
  TopRuleCstChildren,
  VariableStatementCstChildren,
} from "../CSTVisitor/compilang_cst.d.ts";
import { parser } from "../parser/index.ts";

interface TypedVar {
  value: string;
  type: string;
}

const BaseCSTVisitor = parser.getBaseCstVisitorConstructorWithDefaults();

class TypeCheckerVisitor extends BaseCSTVisitor {
  private typedVars: TypedVar[];
  private definedTypes: string[];

  constructor() {
    super();
    this.typedVars = [];
    //TODO: ver como defino tipos custom raros
    this.definedTypes = [
      "string",
      "number",
      "boolean",
      "any",
      "object",
      "array",
    ];
    this.validateVisitor();
  }

  private getType(variable: any): string {
    if (Array.isArray(variable)) return "array";
    else if (typeof variable === "object") return "object";
    else if (typeof variable === "number") return "number";
    else if (typeof variable === "string") return "string";
    else if (typeof variable === "boolean") return "boolean";
    return "any";
  }

  topRule(ctx: TopRuleCstChildren) {
    //TODO: rodear con try catch con error custom
    if (!ctx.statement) return;
    for (const node of ctx.statement) {
      this.visit(node);
    }
  }

  statement(ctx: StatementCstChildren) {
    if (ctx.emptyStatement) this.visit(ctx.emptyStatement);
    if (ctx.variableStatement) this.visit(ctx.variableStatement);
    if (ctx.breakStatement) this.visit(ctx.breakStatement);
    if (ctx.continueStatement) this.visit(ctx.continueStatement);
    if (ctx.blockStatement) this.visit(ctx.blockStatement);
    if (ctx.ifStatement) this.visit(ctx.ifStatement);
    if (ctx.whileStatement) this.visit(ctx.whileStatement);
    if (ctx.doUntilStatement) this.visit(ctx.doUntilStatement);
    if (ctx.forStatement) this.visit(ctx.forStatement);
    if (ctx.callStatement) this.visit(ctx.callStatement);
    if (ctx.returnStatement) this.visit(ctx.returnStatement);
    if (ctx.functionStatement) this.visit(ctx.functionStatement);
  }

  // ifStatement(ctx: IfStatementCstChildren) {
  //   const res: any = { if: [] };
  //   const statements = ctx.statement.map((stmt) => this.visit(stmt));
  //   const expressions = ctx.parenExpression.map((expr) => this.visit(expr));
  //   for (let i = 0; i < expressions.length; i++) {
  //     res.if.push({
  //       cond: expressions[i],
  //       then: statements[i],
  //     });
  //   }
  //   if (ctx.Else) {
  //     res.else = statements[statements.length - 1];
  //   }
  //   return res;
  // }

  // whileStatement(ctx: WhileStatementCstChildren) {
  //   return {
  //     while: this.visit(ctx.parenExpression),
  //     do: this.visit(ctx.statement),
  //   };
  // }

  // doUntilStatement(ctx: DoUntilStatementCstChildren) {
  //   return {
  //     do: this.visit(ctx.statement),
  //     until: this.visit(ctx.parenExpression),
  //   };
  // }

  // forStatement(ctx: ForStatementCstChildren) {
  //   const expressions = ctx.expression.map((expr) => this.visit(expr));
  //   const res: any = {
  //     iterator: ctx.Identifier[0].image,
  //     from: expressions[0],
  //     to: expressions[1],
  //     do: this.visit(ctx.blockStatement),
  //   };
  //   if (expressions[2]) res.step = expressions[2];
  //   return res;
  // }

  // callStatement(ctx: CallStatementCstChildren) {
  //   return this.visit(ctx.callExpression);
  // }

  // callExpression(ctx: CallExpressionCstChildren) {
  //   const args = ctx.funcargs.flatMap((arg) => this.visit(arg));
  //   return {
  //     call: ctx.Identifier[0].image,
  //     args,
  //   };
  // }

  variableStatement(ctx: VariableStatementCstChildren) {
    const variable = {
      value: ctx.Identifier[0].image,
      type: this.getType(this.visit(ctx.expression)),
    };
    //TODO: comparar con el tipo explicito.
    // Si da igual, o no tiene tipo explicito hacer este push
    this.typedVars.push(variable);
    //TODO: sino, tirar error
  }

  // returnStatement(ctx: ReturnStatementCstChildren) {
  //   if (ctx.expression) return { return: this.visit(ctx.expression) };
  //   if (ctx.parenExpression) return { return: this.visit(ctx.parenExpression) };
  // }

  // functionStatement(ctx: FunctionStatementCstChildren) {
  //   const args = ctx.Identifier.map((identifier) => identifier.image);
  //   const functionName = args.shift();
  //   return {
  //     function: functionName,
  //     args,
  //     block: this.visit(ctx.blockStatement),
  //   };
  // }

  // blockStatement(ctx: BlockStatementCstChildren) {
  //   return this.visit(ctx.topRule);
  // }

  // emptyStatement(_: EmptyStatementCstChildren) {
  //   return "noop";
  // }

  // breakStatement(_: BreakStatementCstChildren) {
  //   return "break";
  // }

  // continueStatement(_: ContinueStatementCstChildren) {
  //   return "continue";
  // }

  // funcargs(ctx: FuncargsCstChildren) {
  //   if (!ctx.expression) return [];
  //   return ctx.expression.map((expr) => this.visit(expr));
  // }

  // parenExpression(ctx: ParenExpressionCstChildren) {
  //   return this.visit(ctx.expression);
  // }

  // expression(ctx: ExpressionCstChildren) {
  //   let retVal = null;
  //   if (ctx.Unop && ctx.expression) {
  //     retVal = { unop: ctx.Unop[0].image, arg: this.visit(ctx.expression) };
  //   }
  //   if (ctx.simpleExpression) retVal = this.visit(ctx.simpleExpression);
  //   if (ctx.Binop && ctx.expression) {
  //     retVal = {
  //       binop: ctx.Binop[0].image,
  //       argl: retVal,
  //       argr: this.visit(ctx.expression),
  //     };
  //   }
  //   return retVal;
  // }

  // simpleExpression(ctx: SimpleExpressionCstChildren) {
  //   if (ctx.Integer) return +ctx.Integer[0].image;
  //   if (ctx.False) return false;
  //   if (ctx.True) return true;
  //   if (ctx.Identifier) return ctx.Identifier[0].image;
  //   if (ctx.StringLiteral)
  //     return ctx.StringLiteral[0].image.replace(/^"(.*)"$/, "$1");
  //   if (ctx.array) return this.visit(ctx.array);
  //   if (ctx.dictionary) return this.visit(ctx.dictionary);
  //   if (ctx.callExpression) return this.visit(ctx.callExpression);
  // }

  // array(ctx: ArrayCstChildren) {
  //   if (!ctx.expression) return [];
  //   return ctx.expression.map((expr) => this.visit(expr));
  // }

  // dictionary(ctx: DictionaryCstChildren) {
  //   const retVal: any = { dict: [] };
  //   if (!ctx.Identifier || !ctx.expression) return retVal;
  //   for (let i = 0; i < ctx.Identifier.length; i++) {
  //     const key = ctx.Identifier[i].image;
  //     const value = this.visit(ctx.expression[i]);
  //     retVal.dict.push({ [key]: value });
  //   }
  //   return retVal;
  // }
}

export const typeCheckerVisitor = new TypeCheckerVisitor();