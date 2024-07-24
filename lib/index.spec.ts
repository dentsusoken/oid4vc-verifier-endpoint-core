import { Result, runCatching } from './index';
import { describe, expect, it, vi } from 'vitest';

describe('Result', () => {
  describe('constructor', () => {
    it('should set isSuccess to true if value is provided', () => {
      const result = new Result('success', undefined);
      expect(result.isSuccess).toBe(true);
    });

    it('should set isFailure to true if exception is provided', () => {
      const result = new Result(undefined, new Error('failure'));
      expect(result.isFailure).toBe(true);
    });
  });

  describe('getOrNull', () => {
    it('should return the value if isSuccess is true', () => {
      const result = new Result('success', undefined);
      expect(result.getOrNull()).toBe('success');
    });

    it('should return null if isSuccess is false', () => {
      const result = new Result(undefined, new Error('failure'));
      expect(result.getOrNull()).toBeUndefined();
    });
  });

  describe('exceptionOrNull', () => {
    it('should return the exception if isFailure is true', () => {
      const error = new Error('failure');
      const result = new Result(undefined, error);
      expect(result.exceptionOrNull()).toBe(error);
    });

    it('should return null if isFailure is false', () => {
      const result = new Result('success', undefined);
      expect(result.exceptionOrNull()).toBeUndefined();
    });
  });
});
describe('runCatching', () => {
  it('should return a successful result if the function executes without throwing an exception', () => {
    // Arrange
    const expectedResult = 'result';
    const f = vi.fn().mockReturnValue(expectedResult);

    // Act
    const result = runCatching(f);

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(result.getOrNull()).toBe(expectedResult);
    expect(result.exceptionOrNull()).toBeUndefined();
    expect(f).toHaveBeenCalled();
  });

  it('should return a failure result if the function throws an exception', () => {
    // Arrange
    const expectedException = new Error('failure');
    const f = vi.fn().mockImplementation(() => {
      throw expectedException;
    });

    // Act
    const result = runCatching(f);

    // Assert
    expect(result.isFailure).toBe(true);
    expect(result.getOrNull()).toBeUndefined();
    expect(result.exceptionOrNull()).toBe(expectedException);
    expect(f).toHaveBeenCalled();
  });
});
