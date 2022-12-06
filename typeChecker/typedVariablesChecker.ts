import { IncompatibleTypesError, UndefinedTypeError } from "./typeError.ts";

export interface DefinedType {
  name?: string;
  typename: string;
  children?: DefinedType[];
  funcargs?: TypedVar[];
}

interface TypedVar {
  value: string;
  type: DefinedType;
}

const NATIVE_TYPES = [
  { typename: "string" },
  { typename: "number" },
  { typename: "boolean" },
  { typename: "any" },
  { typename: "object", children: [] },
  { typename: "array" },
];

export class TypedVariablesChecker {
  private typedVars: TypedVar[];
  private definedTypes: DefinedType[];
  private functionBeingAdded?: TypedVar;

  constructor() {
    this.typedVars = [];
    this.definedTypes = NATIVE_TYPES;
  }

  add(variable: TypedVar) {
    const existingVariable = this.typedVars.find(
      (v) => v.value === variable.value
    );
    if (!existingVariable) {
      this.typedVars.push(variable);
    } else {
      if (!this.areCompatible(existingVariable.type, variable.type)) {
        throw new IncompatibleTypesError(variable.type, existingVariable.type);
      }
    }
  }

  getTypeForVariable(variableName: string): DefinedType {
    const variable = this.typedVars.find((v) => v.value === variableName);
    if (!variable) throw new UndefinedTypeError(variableName);
    return variable.type;
  }

  areCompatible(expressionVarType: DefinedType, explicitVarType: DefinedType) {
    const explicitVar = this.definedTypes.find(
      (t) => t.typename === explicitVarType.typename
    );
    if (!explicitVar) throw new UndefinedTypeError(explicitVarType.typename);
    if (expressionVarType.typename === explicitVarType.typename) return true;
    if ([explicitVarType.typename, expressionVarType.typename].includes("any"))
      return true;
    if (this.canBeCompared(expressionVarType, explicitVar)) {
      for (const child of explicitVar.children!) {
        const prop = expressionVarType.children?.find(
          (c) => c.name === child.name
        );
        if (!prop) return false;
        if (prop.typename !== child.typename) return false;
      }
      return true;
    }
    return false;
  }

  canBeCompared(expressionVarType: DefinedType, explicitVarType: DefinedType) {
    return (
      explicitVarType.children &&
      explicitVarType.children &&
      ["object", "any"].includes(expressionVarType.typename)
    );
  }

  defineType(type: DefinedType) {
    if (this.definedTypes.find((t) => t.typename === type.typename))
      throw new Error("Type already defined");
    this.definedTypes.push(type);
  }

  addFunction(variable: TypedVar) {
    this.add(variable);
    this.functionBeingAdded = variable;
  }

  addToCurrentFunction(variable: TypedVar) {
    this.functionBeingAdded?.type.funcargs?.push(variable);
  }
}
