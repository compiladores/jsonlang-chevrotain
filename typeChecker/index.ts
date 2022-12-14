import {
  BlockStatementCstChildren,
  CallExpressionCstChildren,
  CallStatementCstChildren,
  ComparisonCstChildren,
  DictionaryCstChildren,
  EqualtyCstChildren,
  ExpressionCstChildren,
  FactorCstChildren,
  ForStatementCstChildren,
  FuncargDefinitionCstChildren,
  FuncargsCstChildren,
  FuncargsDefinitionCstChildren,
  FunctionStatementCstChildren,
  MethodCstChildren,
  ParenExpressionCstChildren,
  SimpleExpressionCstChildren,
  StatementCstChildren,
  StringCstChildren,
  TermCstChildren,
  TopRuleCstChildren,
  TypeStatementCstChildren,
  UnaryCstChildren,
  VariableCstChildren,
  VariableStatementCstChildren,
} from "../CSTVisitor/compilang_cst.d.ts";
import { parser } from "../parser/index.ts";
import { DefinedType, TypedVariablesChecker } from "./typedVariablesChecker.ts";
import { IncompatibleTypesError } from "./typeError.ts";

const BaseCSTVisitor = parser.getBaseCstVisitorConstructorWithDefaults();

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
    if (ctx.typeStatement) this.visit(ctx.typeStatement);
  }

  forStatement(ctx: ForStatementCstChildren) {
    this.typedVariables.add({
      value: ctx.Identifier[0].image,
      type: { typename: "number" },
    });
  }

  typeStatement(ctx: TypeStatementCstChildren) {
    const identifiers = ctx.Identifier.map((i) => i.image);
    if (identifiers.length > 0) {
      const newType: DefinedType = {
        typename: identifiers.shift()!,
        children: [],
      };
      let i = 0;
      while (i < identifiers.length) {
        newType.children?.push({
          name: identifiers[i],
          typename: identifiers[i + 1],
        });
        i += 2;
      }
      this.typedVariables.defineType(newType);
    }
  }

  callStatement(ctx: CallStatementCstChildren) {
    return this.visit(ctx.callExpression);
  }

  callExpression(ctx: CallExpressionCstChildren) {
    const type = this.typedVariables.getTypeForVariable(
      ctx.Identifier[0].image
    );
    const functionArgs = type.funcargs!;
    const expressionArgs = this.visit(ctx.funcargs);
    for (let i = 0; i < functionArgs.length; i++) {
      if (
        !this.typedVariables.areCompatible(
          functionArgs[i].type,
          expressionArgs[i]
        )
      ) {
        throw new IncompatibleTypesError(
          expressionArgs[i],
          functionArgs[i].type
        );
      }
    }
    return type;
  }

  funcargs(ctx: FuncargsCstChildren) {
    if (!ctx.expression) return [];
    return ctx.expression.map((e) => this.visit(e));
  }

  variableStatement(ctx: VariableStatementCstChildren) {
    const expressionType: DefinedType = this.visit(ctx.expression);
    if (ctx.Colon) {
      const explicitTypename = ctx.Identifier[1].image;
      const explicitType: DefinedType = { typename: explicitTypename };
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

  functionStatement(ctx: FunctionStatementCstChildren) {
    const returnTypename = ctx.Identifier[1] ? ctx.Identifier[1].image : "any";
    this.typedVariables.addFunction({
      value: ctx.Identifier[0].image,
      type: { typename: returnTypename, funcargs: [] },
    });
    ctx.funcargsDefinition.map((d) => this.visit(d));
  }

  funcargsDefinition(ctx: FuncargsDefinitionCstChildren) {
    if (ctx.funcargDefinition) ctx.funcargDefinition.map((d) => this.visit(d));
  }

  funcargDefinition(ctx: FuncargDefinitionCstChildren) {
    const typename = ctx.Identifier[1] ? ctx.Identifier[1].image : "any";
    this.typedVariables.addToCurrentFunction({
      value: ctx.Identifier[0].image,
      type: { typename },
    });
  }

  blockStatement(ctx: BlockStatementCstChildren) {
    return this.visit(ctx.topRule);
  }

  parenExpression(ctx: ParenExpressionCstChildren) {
    return this.visit(ctx.expression);
  }

  expression(ctx: ExpressionCstChildren): DefinedType {
    if (ctx.LogicalBinop) return { typename: "boolean" };
    return this.visit(ctx.equalty[0]);
  }

  equalty(ctx: EqualtyCstChildren): DefinedType {
    if (ctx.EqualtyBinop) return { typename: "boolean" };
    return this.visit(ctx.comparison[0]);
  }

  comparison(ctx: ComparisonCstChildren): DefinedType {
    if (ctx.ComparisonBinop) return { typename: "boolean" };
    return this.visit(ctx.term[0]);
  }

  term(ctx: TermCstChildren): DefinedType {
    if (ctx.TermBinop) {
      const operators = ctx.TermBinop.map((op) => op.image);
      const allPlusOperators = operators.every((op) => op === "+");
      const factorTypes: DefinedType[] = ctx.factor.map((f) => this.visit(f));
      const allStrings = factorTypes.every((f) => f.typename === "string");
      const allNumbers = factorTypes.every((f) => f.typename === "number");
      if (allPlusOperators && allStrings) return { typename: "string" };
      if (allNumbers) return { typename: "number" };
      throw new Error("Invalid expression");
    }
    return this.visit(ctx.factor[0]);
  }

  factor(ctx: FactorCstChildren): DefinedType {
    if (ctx.FactorBinop) {
      const unaryTypes: DefinedType[] = ctx.unary.map((u) => this.visit(u));
      const allNumbers = unaryTypes.every((f) => f.typename === "number");
      if (allNumbers) return { typename: "number" };
      throw new Error("Invalid expression");
    }
    return this.visit(ctx.unary[0]);
  }

  unary(ctx: UnaryCstChildren): DefinedType {
    if (ctx.Unop && ctx.unary) {
      const unop = ctx.Unop[0].image;
      const unary: DefinedType = this.visit(ctx.unary[0]);
      if (unary.typename === "number" && unop === "-")
        return { typename: "number" };
      if (unary.typename === "number" && unop === "not")
        return { typename: "boolean" };
      if (unary.typename === "boolean" && unop === "not")
        return { typename: "boolean" };
      throw new Error("Invalid expression");
    }
    if (ctx.simpleExpression) return this.visit(ctx.simpleExpression);
    throw new Error();
  }

  simpleExpression(ctx: SimpleExpressionCstChildren): DefinedType {
    if (ctx.Integer) return { typename: "number" };
    if (ctx.False || ctx.True) return { typename: "boolean" };
    if (ctx.string) return this.visit(ctx.string);
    if (ctx.variable) return this.visit(ctx.variable);
    if (ctx.accesor) return { typename: "number" };
    if (ctx.array) return { typename: "array" };
    if (ctx.dictionary) return this.visit(ctx.dictionary);
    if (ctx.callExpression) return this.visit(ctx.callExpression);
    throw new Error("Invalid expression");
  }

  string(ctx: StringCstChildren) {
    if (ctx.StringLiteral) {
      if (ctx.method) {
        return this.visit(ctx.method);
      }
      return { typename: "string" };
    }
  }

  variable(ctx: VariableCstChildren) {
    if (ctx.Identifier) {
      if (ctx.method) {
        return this.visit(ctx.method);
      }
      return this.typedVariables.getTypeForVariable(ctx.Identifier[0].image);
    }
  }

  dictionary(ctx: DictionaryCstChildren): DefinedType {
    const retVal: DefinedType = { typename: "object", children: [] };
    if (!ctx.Identifier || !ctx.expression) return retVal;
    for (let i = 0; i < ctx.Identifier.length; i++) {
      const name = ctx.Identifier[i].image;
      const type: DefinedType = this.visit(ctx.expression[i]);
      retVal.children?.push({ name, typename: type.typename });
    }
    return retVal;
  }

  method(ctx: MethodCstChildren) {
    if (ctx.Identifier) {
      const method = ctx.Identifier[0].image;
      console.log({ a: "here", method });
      if (method === "length") return { typename: "number" };
      if (method === "slice") return { typename: "string" };
      if (method === "keys") return { typename: "array" };
    }
  }
}
