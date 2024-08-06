import { describe, it, expect } from 'vitest';
import { Result, runCatching, runAsyncCatching } from './result';

describe('Result', () => {
  describe('success', () => {
    it('should create a successful result', () => {
      const result = Result.success(42);
      expect(result.isSuccess).toBe(true);
      expect(result.isFailure).toBe(false);
    });
  });

  describe('failure', () => {
    it('should create a failure result', () => {
      const error = new Error('Something went wrong');
      const result = Result.failure(error);
      expect(result.isSuccess).toBe(false);
      expect(result.isFailure).toBe(true);
    });
  });

  describe('getOrUndefined', () => {
    it('should return the value if the result is successful', () => {
      const result = Result.success(42);
      expect(result.getOrUndefined()).toBe(42);
    });

    it('should return undefined if the result is a failure', () => {
      const error = new Error('Something went wrong');
      const result = Result.failure(error);
      expect(result.getOrUndefined()).toBeUndefined();
    });
  });

  describe('exceptionOrUndefined', () => {
    it('should return undefined if the result is successful', () => {
      const result = Result.success(42);
      expect(result.exceptionOrUndefined()).toBeUndefined();
    });

    it('should return the error if the result is a failure', () => {
      const error = new Error('Something went wrong');
      const result = Result.failure(error);
      expect(result.exceptionOrUndefined()).toBe(error);
    });
  });

  describe('getOrThrow', () => {
    it('should return the value if the result is successful', () => {
      const result = Result.success(42);
      expect(result.getOrThrow()).toBe(42);
    });

    it('should throw the error if the result is a failure', () => {
      const error = new Error('Something went wrong');
      const result = Result.failure(error);
      expect(() => result.getOrThrow()).toThrowError(error);
    });
  });

  describe('getOrDefault', () => {
    it('should return the value if the result is successful', () => {
      const result = Result.success(42);
      expect(result.getOrDefault(0)).toBe(42);
    });

    it('should return the default value if the result is a failure', () => {
      const error = new Error('Something went wrong');
      const result = Result.failure(error);
      expect(result.getOrDefault(0)).toBe(0);
    });
  });

  describe('getOrElse', () => {
    it('should return the value if the result is successful', () => {
      const result = Result.success(42);
      expect(result.getOrElse(() => 0)).toBe(42);
    });

    it('should return the value from the onFailure function if the result is a failure', () => {
      const error = new Error('Something went wrong');
      const result = Result.failure(error);
      expect(result.getOrElse(() => 0)).toBe(0);
    });
  });

  describe('onSuccess', () => {
    it('should execute the function if the result is successful', () => {
      const result = Result.success(42);
      let executed = false;
      result.onSuccess(() => {
        executed = true;
      });
      expect(executed).toBe(true);
    });

    it('should not execute the function if the result is a failure', () => {
      const error = new Error('Something went wrong');
      const result = Result.failure(error);
      let executed = false;
      result.onSuccess(() => {
        executed = true;
      });
      expect(executed).toBe(false);
    });
  });

  describe('onFailure', () => {
    it('should not execute the function if the result is successful', () => {
      const result = Result.success(42);
      let executed = false;
      result.onFailure(() => {
        executed = true;
      });
      expect(executed).toBe(false);
    });

    it('should execute the function if the result is a failure', () => {
      const error = new Error('Something went wrong');
      const result = Result.failure(error);
      let executed = false;
      result.onFailure(() => {
        executed = true;
      });
      expect(executed).toBe(true);
    });
  });

  describe('fold', () => {
    it('should apply the onSuccess function if the result is successful', () => {
      const result = Result.success(42);
      const value = result.fold(
        (value) => value + 1,
        () => 0
      );
      expect(value).toBe(43);
    });

    it('should apply the onFailure function if the result is a failure', () => {
      const error = new Error('Something went wrong');
      const result = Result.failure(error);
      const value = result.fold(
        () => 'success',
        (error) => error.message
      );
      expect(value).toBe('Something went wrong');
    });
  });

  describe('map', () => {
    it('should transform the value if the result is successful', () => {
      const result = Result.success(42);
      const mappedResult = result.map((value) => value + 1);
      expect(mappedResult.isSuccess).toBe(true);
      expect(mappedResult.getOrUndefined()).toBe(43);
    });

    it('should return a failure result if the result is a failure', () => {
      const error = new Error('Something went wrong');
      const result: Result<number> = Result.failure(error);
      const mappedResult = result.map((value) => value + 1);
      expect(mappedResult.isFailure).toBe(true);
      expect(mappedResult.exceptionOrUndefined()).toBe(error);
    });
  });

  describe('mapCatching', () => {
    it('should transform the value if the result is successful and the transformation succeeds', () => {
      const result = Result.success(42);
      const mappedResult = result.mapCatching((value) => value + 1);
      expect(mappedResult.isSuccess).toBe(true);
      expect(mappedResult.getOrUndefined()).toBe(43);
    });

    it('should return a failure result if the result is successful and the transformation throws an error', () => {
      const result = Result.success(42);
      const mappedResult = result.mapCatching(() => {
        throw new Error('Transformation failed');
      });
      expect(mappedResult.isFailure).toBe(true);
      expect(mappedResult.exceptionOrUndefined()?.message).toBe(
        'Transformation failed'
      );
    });

    it('should return a failure result if the result is a failure', () => {
      const error = new Error('Something went wrong');
      const result: Result<number> = Result.failure(error);
      const mappedResult = result.mapCatching((value) => value + 1);
      expect(mappedResult.isFailure).toBe(true);
      expect(mappedResult.exceptionOrUndefined()).toBe(error);
    });
  });

  describe('recover', () => {
    it('should return the current successful result if the result is successful', () => {
      const result = Result.success(42);
      const recoveredResult = result.recover(() => 0);
      expect(recoveredResult.isSuccess).toBe(true);
      expect(recoveredResult.getOrUndefined()).toBe(42);
    });

    it('should return a new successful result with the recovered value if the result is a failure', () => {
      const error = new Error('Something went wrong');
      const result = Result.failure(error);
      const recoveredResult = result.recover(() => 0);
      expect(recoveredResult.isSuccess).toBe(true);
      expect(recoveredResult.getOrUndefined()).toBe(0);
    });
  });

  describe('recoverCatching', () => {
    it('should return the current successful result if the result is successful', () => {
      const result = Result.success(42);
      const recoveredResult = result.recoverCatching(() => 0);
      expect(recoveredResult.isSuccess).toBe(true);
      expect(recoveredResult.getOrUndefined()).toBe(42);
    });

    it('should return a new successful result with the recovered value if the result is a failure and the recovery succeeds', () => {
      const error = new Error('Something went wrong');
      const result = Result.failure(error);
      const recoveredResult = result.recoverCatching(() => 0);
      expect(recoveredResult.isSuccess).toBe(true);
      expect(recoveredResult.getOrUndefined()).toBe(0);
    });

    it('should return a failure result if the result is a failure and the recovery throws an error', () => {
      const error = new Error('Something went wrong');
      const result = Result.failure(error);
      const recoveredResult = result.recoverCatching(() => {
        throw new Error('Recovery failed');
      });
      expect(recoveredResult.isFailure).toBe(true);
      expect(recoveredResult.exceptionOrUndefined()?.message).toBe(
        'Recovery failed'
      );
    });
  });

  describe('runCatching', () => {
    it('should return a successful result if the function executes successfully', () => {
      const result = runCatching(() => 42);
      expect(result.isSuccess).toBe(true);
      expect(result.getOrUndefined()).toBe(42);
    });

    it('should return a failure result if the function throws an error', () => {
      const result = runCatching(() => {
        throw new Error('Something went wrong');
      });
      expect(result.isFailure).toBe(true);
      expect(result.exceptionOrUndefined()?.message).toBe(
        'Something went wrong'
      );
    });

    it('should pass arguments to the function', () => {
      const result = runCatching((a: number, b: number) => a + b, 1, 2);
      expect(result.isSuccess).toBe(true);
      expect(result.getOrUndefined()).toBe(3);
    });
  });

  describe('runAsyncCatching', () => {
    it('should return a successful result if the asynchronous function executes successfully', async () => {
      const result = await runAsyncCatching(async () => 42);
      expect(result.isSuccess).toBe(true);
      expect(result.getOrUndefined()).toBe(42);
    });

    it('should return a failure result if the asynchronous function throws an error', async () => {
      const result = await runAsyncCatching(async () => {
        throw new Error('Something went wrong');
      });
      expect(result.isFailure).toBe(true);
      expect(result.exceptionOrUndefined()?.message).toBe(
        'Something went wrong'
      );
    });

    it('should pass arguments to the asynchronous function', async () => {
      const result = await runAsyncCatching(
        async (a: number, b: number) => a + b,
        1,
        2
      );
      expect(result.isSuccess).toBe(true);
      expect(result.getOrUndefined()).toBe(3);
    });
  });
});
