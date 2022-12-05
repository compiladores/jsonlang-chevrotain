import { DefinedType } from "./typedVariablesChecker.ts";

export class IncompatibleTypesError extends Error {
  constructor(newType: DefinedType, existingType: DefinedType) {
    super(
      `Type "${newType.typename}" is not assignable to type "${existingType.typename}"`
    );
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class UndefinedTypeError extends Error {
  constructor(type: string) {
    super(`Cannot find name "${type}"`);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
