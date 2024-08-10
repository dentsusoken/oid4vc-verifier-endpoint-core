import { describe, it, expect } from 'vitest';
import { ensure } from './ensure';

describe('ensure', () => {
  it('should not throw an error when the condition is true', () => {
    expect(() => {
      ensure(true, () => {
        throw new Error('This should not be thrown');
      });
    }).not.toThrow();
  });

  it('should throw an error when the condition is false', () => {
    expect(() => {
      ensure(false, () => {
        throw new Error('This error should be thrown');
      });
    }).toThrowError('This error should be thrown');
  });

  it('should throw a specific error when the condition is false', () => {
    class CustomError extends Error {
      constructor(message: string) {
        super(message);
        this.name = 'CustomError';
      }
    }

    expect(() => {
      ensure(false, () => {
        throw new CustomError('This is a custom error');
      });
    }).toThrowError(new CustomError('This is a custom error'));
  });
});
