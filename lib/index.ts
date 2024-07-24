export * from './domain/Presentation';
export * from './domain/VerifierConfig';
export * from './kotlin';

export type Duration = number;

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
