"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
__exportStar(require("./domain"), exports);
__exportStar(require("./kotlin"), exports);
// export class Result<T> {
//   public isSuccess: boolean = false;
//   public isFailure: boolean = false;
//   constructor(
//     private value: T | undefined,
//     private exception: Error | undefined
//   ) {
//     if (value) this.isSuccess = true;
//     if (exception) this.isFailure = true;
//   }
//   getOrNull() {
//     return this.value;
//   }
//   exceptionOrNull() {
//     return this.exception;
//   }
// }
// export const runCatching = <T>(f: (...args: unknown[]) => unknown) => {
//   try {
//     return new Result<T>(f() as T, undefined);
//     // eslint-disable-next-line no-explicit-any
//   } catch (e: any) {
//     return new Result<T>(undefined, e);
//   }
// };
