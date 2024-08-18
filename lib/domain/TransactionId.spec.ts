import { describe, it, expect } from 'vitest';
import { TransactionId } from './TransactionId';
import { ZodError } from 'zod';

describe('TransactionId', () => {
  it('should create an instance of TransactionId with a valid value', () => {
    const value = 'abc123';
    const transactionId = new TransactionId(value);
    expect(transactionId.constructor).toBe(TransactionId);
    expect(transactionId.value).toBe(value);
  });

  it('should throw an error when creating an instance with an empty value', () => {
    expect(() => new TransactionId('')).toThrowError('value is required');
  });

  it('should throw an error when creating an idnstance with a null value', () => {
    expect(() => new TransactionId(null as never)).toThrowError(
      'value is required'
    );
  });

  it('should throw an error when creating an instance with an undefined value', () => {
    expect(() => new TransactionId(undefined as never)).toThrowError(
      'value is required'
    );
  });

  describe('fromJSON', () => {
    it('should create a TransactionId instance from a valid JSON string', () => {
      const json = 'abc123';
      const transactionId = TransactionId.fromJSON(json);
      expect(transactionId).toBeInstanceOf(TransactionId);
      expect(transactionId.value).toBe(json);
    });

    it('should throw a ZodError with the expected error object when the JSON value is null', () => {
      const json = null;

      try {
        TransactionId.fromJSON(json);
        expect.fail('Expected a ZodError to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ZodError);
        expect(error instanceof ZodError && error.issues).toEqual([
          {
            code: 'invalid_type',
            expected: 'string',
            received: 'null',
            path: [],
            message: 'Expected string, received null',
          },
        ]);
      }
    });

    it('should throw a ZodError with the expected error object when the JSON value is undefined', () => {
      const json = undefined;

      try {
        TransactionId.fromJSON(json);
        expect.fail('Expected a ZodError to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ZodError);
        expect(error instanceof ZodError && error.issues).toEqual([
          {
            code: 'invalid_type',
            expected: 'string',
            received: 'undefined',
            path: [],
            message: 'Required',
          },
        ]);
      }
    });

    it('should throw a ZodError with the expected error object when the JSON value is a number', () => {
      const json = 123;

      try {
        TransactionId.fromJSON(json);
        expect.fail('Expected a ZodError to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ZodError);
        expect(error instanceof ZodError && error.issues).toEqual([
          {
            code: 'invalid_type',
            expected: 'string',
            received: 'number',
            path: [],
            message: 'Expected string, received number',
          },
        ]);
      }
    });
  });

  describe('toJSON', () => {
    it('should return the value of the TransactionId instance as a string', () => {
      const value = 'abc123';
      const transactionId = new TransactionId(value);
      expect(transactionId.toJSON()).toBe(value);
    });
  });

  describe('fromJSON', () => {
    it('should return the TransactionId instance from JSON', () => {
      const value = 'abc123';
      const transactionId = new TransactionId(value);
      expect(TransactionId.fromJSON(value)).toEqual(transactionId);
    });
  });

  describe('constructor', () => {
    it('should create a TransactionId instance with a valid value', () => {
      const value = 'abc123';
      const transactionId = new TransactionId(value);
      expect(transactionId).toBeInstanceOf(TransactionId);
      expect(transactionId.value).toBe(value);
    });

    it('should throw an error when creating a TransactionId instance with an empty value', () => {
      expect(() => new TransactionId('')).toThrowError('value is required');
    });

    it('should throw an error when creating a TransactionId instance with a null value', () => {
      expect(() => new TransactionId(null as unknown as string)).toThrowError(
        'value is required'
      );
    });

    it('should throw an error when creating a TransactionId instance with an undefined value', () => {
      expect(
        () => new TransactionId(undefined as unknown as string)
      ).toThrowError('value is required');
    });
  });
});
