import { IncompatibleTypesError, UndefinedTypeError } from "./typeError.ts";

interface TypedVar {
  value: string;
  type: string;
}

const NATIVE_TYPES = ["string", "number", "boolean", "any", "object", "array"];

//TODO: ver como defino tipos custom raros

export class TypedVariablesChecker {
  private typedVars: TypedVar[];
  private definedTypes: string[];

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

  areCompatible(existingVarType: string, expressionVarType: string): boolean {
    const expressionVar = this.definedTypes.find(
      (t) => t === expressionVarType
    );
    if (!expressionVar) throw new UndefinedTypeError(expressionVarType);
    if (existingVarType === expressionVarType) return true;
    return false;
    //TODO: chequear compatibilidad de diccionario con tipo definido
  }

  // defineType() {}
}
