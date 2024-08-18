import { describe, it, expect } from 'vitest';
import { Nonce } from './Nonce';
import { ZodError } from 'zod';

describe('Nonce', () => {
  describe('constructor', () => {
    it('should create an instance of Nonce with the provided value', () => {
      const value = 'abc123';
      const nonce = new Nonce(value);
      expect(nonce).toBeInstanceOf(Nonce);
      expect(nonce.value).toBe(value);
    });

    it('should throw an error if the value is falsy', () => {
      expect(() => new Nonce('')).toThrowError('value is required');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => new Nonce(null as any)).toThrowError('value is required');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => new Nonce(undefined as any)).toThrowError(
        'value is required'
      );
    });
  });

  describe('fromJSON', () => {
    it('should create an instance of Nonce from the provided JSON value', () => {
      const value = 'abc123';
      const nonce = Nonce.fromJSON(value);
      expect(nonce).toBeInstanceOf(Nonce);
      expect(nonce.value).toBe(value);
    });

    it('should throw a ZodError with the expected error object when the JSON value is an empty string', () => {
      const json = '';

      try {
        Nonce.fromJSON(json);
        expect.fail('Expected a ZodError to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ZodError);
        expect(error instanceof ZodError && error.issues).toEqual([
          {
            code: 'too_small',
            minimum: 1,
            type: 'string',
            inclusive: true,
            exact: false,
            message: 'String must contain at least 1 character(s)',
            path: [],
          },
        ]);
      }
    });

    it('should throw a ZodError with the expected error object when the JSON value is not a string', () => {
      const json = 123;

      try {
        Nonce.fromJSON(json);
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
    it('should return the JSON representation of the Nonce', () => {
      const value = 'abc123';
      const nonce = new Nonce(value);
      expect(nonce.toJSON()).toBe(value);
    });
  });
});
