import { CoreError } from "tydet-core";

export class RedisCoreError extends CoreError {
  name: string

  constructor(message?: string) {
    super();
    Object.setPrototypeOf(this, RedisCoreError.prototype);
    this.name = this.constructor.name
    this.message = message
    if (Error.captureStackTrace) Error.captureStackTrace(this, RedisCoreError);
  }
}