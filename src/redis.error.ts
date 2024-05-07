import { CoreError } from "tydet-core";

export class RedisCoreError extends CoreError {
  name: string

  constructor(message?: string, sql?: string) {
    super(message);
    this.name = "RedisCoreError";
    this.message = message;
    this.stack = (new Error(this.message)).stack;  //`${this.message}\n${new Error().stack}`;
  }
}