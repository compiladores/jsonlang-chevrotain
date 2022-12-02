import { IncompatibleTypesError, UndefinedTypeError } from "./typeError.ts";

interface TypedVar {
  value: string;
  type: string;
}

export interface DefinedType {
  name?: string;
  type: string;
  children?: DefinedType[];
}

const NATIVE_TYPES = [
  { type: "string" },
  { type: "number" },
  { type: "boolean" },
  { type: "any" },
  { type: "object" },
  { type: "array" },
];

export class TypedVariablesChecker {
  private typedVars: TypedVar[];
  private definedTypes: DefinedType[];

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
        console.log(existingVariable.type, variable.type);
        throw new IncompatibleTypesError(variable.type, existingVariable.type);
      }
    }
  }

  getTypeForVariable(variableName: string) {
    console.log({ ad: this.typedVars });
    const variable = this.typedVars.find((v) => v.value === variableName);
    if (!variable) throw new UndefinedTypeError(variableName);
    return variable.type;
  }

  areCompatible(expressionVarType: string, explicitVarType: string): boolean {
    const explicitVar = this.definedTypes.find(
      (t) => t.type === explicitVarType
    );
    if (!explicitVar) throw new UndefinedTypeError(explicitVarType);
    if (expressionVarType === explicitVarType) return true;
    return false;
    //TODO: chequear compatibilidad de diccionario con tipo definido
  }

  defineType(type: DefinedType) {
    if (this.definedTypes.find((t) => t.type === type.type))
      throw new Error("Type already defined");
    this.definedTypes.push(type);
  }
}
