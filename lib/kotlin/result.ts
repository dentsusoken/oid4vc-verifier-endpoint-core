export class Result<T> {
  public readonly isSuccess: boolean;
  public readonly isFailure: boolean;

  static success<T>(value: T): Result<T> {
    return new Result(value, null);
  }

  static failure<T>(exception: Error): Result<T> {
    return new Result<T>(null, exception);
  }

  private constructor(private value: T | null, private error: Error | null) {
    this.isSuccess = error === null;
    this.isFailure = error !== null;

    if (this.isSuccess && this.isFailure) {
      throw new Error('Result cannot be both success and failure');
    }

    if (!this.isSuccess && !this.isFailure) {
      throw new Error('Result must be either success or failure');
    }
  }

  getOrNull(): T | null {
    return this.value;
  }

  exceptionOrNull(): Error | null {
    return this.error;
  }

  getOrThrow(): T {
    if (this.isSuccess) {
      return this.value!;
    }

    throw this.error;
  }

  getOrDefault(defaultValue: T): T {
    return this.isSuccess ? this.value! : defaultValue;
  }

  getOrElse(onFailure: (error: Error) => T): T {
    return this.isSuccess ? this.value! : onFailure(this.error!);
  }

  onSuccess(f: (value: T) => void): Result<T> {
    if (this.isSuccess) {
      f(this.value!);
    }

    return this;
  }

  onFailure(f: (error: Error) => void): Result<T> {
    if (this.isFailure) {
      f(this.error!);
    }

    return this;
  }

  fold<R>(onSuccess: (value: T) => R, onFailure: (error: Error) => R): R {
    return this.isSuccess ? onSuccess(this.value!) : onFailure(this.error!);
  }

  map<R>(transform: (value: T) => R): Result<R> {
    return this.isSuccess
      ? Result.success(transform(this.value!))
      : Result.failure(this.error!);
  }

  mapCatching<R>(transform: (value: T) => R): Result<R> {
    return this.isSuccess
      ? runCatching(() => transform(this.value!))
      : Result.failure(this.error!);
  }

  recover(transform: (error: Error) => T): Result<T> {
    return this.isFailure ? Result.success(transform(this.error!)) : this;
  }

  recoverCatching(transform: (error: Error) => T): Result<T> {
    return this.isFailure ? runCatching(() => transform(this.error!)) : this;
  }
}

export const runCatching = <T, A extends unknown[]>(
  f: (...args: A) => T,
  ...args: A
): Result<T> => {
  try {
    const value = f(...args);
    return Result.success(value);
  } catch (e) {
    if (e instanceof Error) {
      return Result.failure(e);
    }

    return Result.failure(new Error(String(e)));
  }
};
