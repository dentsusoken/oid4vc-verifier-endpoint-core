import 'reflect-metadata';
export * from './adapters/out/cfg';
export * from './adapters/out/jose';
export * from './adapters/out/persistence';
export * from './di';
export * from './domain';
export * from './ports/input';
export * from './ports/out/cfg';
export * from './ports/out/jose';
export * from './ports/out/persistence';
export * from './services/input';
export * from './kotlin';

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
