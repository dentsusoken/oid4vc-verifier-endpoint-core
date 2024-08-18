import { describe, it, expect } from 'vitest';
import { RequestId } from './RequestId';
import { ZodError } from 'zod';

describe('RequestId', () => {
  describe('constructor', () => {
    it('should create an instance of RequestId with the provided value', () => {
      const value = 'abc123';
      const requestId = new RequestId(value);
      expect(requestId).toBeInstanceOf(RequestId);
      expect(requestId.value).toBe(value);
    });

    it('should throw an error if the value is falsy', () => {
      expect(() => new RequestId('')).toThrowError('value is required');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => new RequestId(null as any)).toThrowError(
        'value is required'
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => new RequestId(undefined as any)).toThrowError(
        'value is required'
      );
    });
  });

  describe('fromJSON', () => {
    it('should create an instance of RequestId from the provided JSON value', () => {
      const value = 'abc123';
      const requestId = RequestId.fromJSON(value);
      expect(requestId).toBeInstanceOf(RequestId);
      expect(requestId.value).toBe(value);
    });

    it('should throw a ZodError with the expected error object when the JSON value is null', () => {
      const json = null;

      try {
        RequestId.fromJSON(json);
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
        RequestId.fromJSON(json);
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
        RequestId.fromJSON(json);
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
    it('should return the JSON representation of the RequestId', () => {
      const value = 'abc123';
      const requestId = new RequestId(value);
      expect(requestId.toJSON()).toBe(value);
    });
  });
});
