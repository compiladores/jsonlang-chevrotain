import {
  BlockStatementCstChildren,
  ComparisonCstChildren,
  EqualtyCstChildren,
  ExpressionCstChildren,
  FactorCstChildren,
  ForStatementCstChildren,
  ParenExpressionCstChildren,
  SimpleExpressionCstChildren,
  StatementCstChildren,
  TermCstChildren,
  TopRuleCstChildren,
  UnaryCstChildren,
  VariableStatementCstChildren,
} from "../CSTVisitor/compilang_cst.d.ts";
import { parser } from "../parser/index.ts";
import { TypedVariablesChecker } from "./typedVariablesChecker.ts";
import { IncompatibleTypesError } from "./typeError.ts";

const BaseCSTVisitor = parser.getBaseCstVisitorConstructorWithDefaults();

//TODO: definir tipos mediante lo nuevo del parser
//TODO: arrays
//TODO: diccionarios
//TODO: funciones y calls
//TODO: any en expressions?

export class TypeCheckerVisitor extends BaseCSTVisitor {
  private typedVariables: TypedVariablesChecker;
  constructor() {
    super();
    this.typedVariables = new TypedVariablesChecker();
    this.validateVisitor();
  }

  topRule(ctx: TopRuleCstChildren) {
    if (!ctx.statement) return;
    try {
      for (const node of ctx.statement) {
        this.visit(node);
      }
    } catch (e) {
      throw e;
    }
  }

  statement(ctx: StatementCstChildren) {
    if (ctx.variableStatement) this.visit(ctx.variableStatement);
    if (ctx.blockStatement) this.visit(ctx.blockStatement);
    if (ctx.forStatement) this.visit(ctx.forStatement);
    if (ctx.callStatement) this.visit(ctx.callStatement);
    if (ctx.returnStatement) this.visit(ctx.returnStatement);
    if (ctx.functionStatement) this.visit(ctx.functionStatement);
  }

  forStatement(ctx: ForStatementCstChildren) {
    this.typedVariables.add({
      value: ctx.Identifier[0].image,
      type: "number",
    });
  }

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
    const expressionType = this.visit(ctx.expression);
    if (ctx.Colon) {
      const explicitType = ctx.Identifier[1].image;
      if (!this.typedVariables.areCompatible(expressionType, explicitType)) {
        throw new IncompatibleTypesError(expressionType, explicitType);
      }
    } else {
      this.typedVariables.add({
        value: ctx.Identifier[0].image,
        type: expressionType,
      });
    }
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

  blockStatement(ctx: BlockStatementCstChildren) {
    return this.visit(ctx.topRule);
  }

  // funcargs(ctx: FuncargsCstChildren) {
  //   if (!ctx.expression) return [];
  //   return ctx.expression.map((expr) => this.visit(expr));
  // }

  parenExpression(ctx: ParenExpressionCstChildren) {
    return this.visit(ctx.expression);
  }

  expression(ctx: ExpressionCstChildren) {
    if (ctx.LogicalBinop) return "boolean";
    return this.visit(ctx.equalty[0]);
  }

  equalty(ctx: EqualtyCstChildren) {
    if (ctx.EqualtyBinop) return "boolean";
    return this.visit(ctx.comparison[0]);
  }

  comparison(ctx: ComparisonCstChildren) {
    if (ctx.ComparisonBinop) return "boolean";
    return this.visit(ctx.term[0]);
  }

  term(ctx: TermCstChildren) {
    if (ctx.TermBinop) {
      const operators = ctx.TermBinop.map((op) => op.image);
      const allPlusOperators = operators.every((op) => op === "+");
      const factorTypes = ctx.factor.map((f) => this.visit(f));
      const allStrings = factorTypes.every((f) => f === "string");
      const allNumbers = factorTypes.every((f) => f === "number");
      if (allPlusOperators && allStrings) return "string";
      if (allNumbers) return "number";
      throw new Error("Invalid expression");
    }
    return this.visit(ctx.factor[0]);
  }

  factor(ctx: FactorCstChildren) {
    if (ctx.FactorBinop) {
      const unaryTypes = ctx.unary.map((u) => this.visit(u));
      const allNumbers = unaryTypes.every((f) => f === "number");
      if (allNumbers) return "number";
      throw new Error("Invalid expression");
    }
    return this.visit(ctx.unary[0]);
  }

  unary(ctx: UnaryCstChildren) {
    if (ctx.Unop && ctx.unary) {
      const unop = ctx.Unop[0].image;
      const unary = this.visit(ctx.unary[0]);
      if (unary === "number" && unop === "-") return "number";
      if (unary === "number" && unop === "not") return "boolean";
      if (unary === "boolean" && unop === "not") return "boolean";
      throw new Error("Invalid expression");
    }
    if (ctx.simpleExpression) return this.visit(ctx.simpleExpression);
  }

  simpleExpression(ctx: SimpleExpressionCstChildren) {
    if (ctx.Integer) return "number";
    if (ctx.False || ctx.True) return "boolean";
    if (ctx.Identifier)
      return this.typedVariables.getTypeForVariable(ctx.Identifier[0].image);
    if (ctx.StringLiteral) return "string";
    if (ctx.array) return "array";
    if (ctx.dictionary) return "object";
    // if (ctx.callExpression) return this.visit(ctx.callExpression);
  }

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
