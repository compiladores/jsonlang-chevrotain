export class IncompatibleTypesError extends Error {
  constructor(newType: string, existingType: string) {
    super(`Type "${newType}" is not assignable to type "${existingType}"`);
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
