import { describe, it, expect } from 'vitest';
import { ResponseCode } from './ResponseCode';
import { ZodError } from 'zod';

describe('ResponseCode', () => {
  describe('constructor', () => {
    it('should create an instance of ResponseCode with a valid value', () => {
      const value = 'example_code';
      const responseCode = new ResponseCode(value);
      expect(responseCode).toBeInstanceOf(ResponseCode);
      expect(responseCode.value).toBe(value);
    });

    it('should throw a ZodError if the value is an empty string', () => {
      const value = '';

      try {
        new ResponseCode(value);
        expect.fail('Expected a ZodError to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ZodError);
        expect(error instanceof ZodError && error.issues).toEqual([
          {
            code: 'too_small',
            exact: false,
            minimum: 1,
            type: 'string',
            inclusive: true,
            message: 'String must contain at least 1 character(s)',
            path: [],
          },
        ]);
      }
    });

    it('should throw a ZodError if the value is not a string', () => {
      const value = 123;

      try {
        new ResponseCode(value as any);
        expect.fail('Expected a ZodError to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ZodError);
        expect(error instanceof ZodError && error.issues).toEqual([
          {
            code: 'invalid_type',
            expected: 'string',
            received: 'number',
            message: 'Expected string, received number',
            path: [],
          },
        ]);
      }
    });
  });

  describe('fromJSON', () => {
    it('should create an instance of ResponseCode from a valid JSON value', () => {
      const json = 'example_code';
      const responseCode = ResponseCode.fromJSON(json);
      expect(responseCode).toBeInstanceOf(ResponseCode);
      expect(responseCode.value).toBe(json);
    });

    it('should throw a ZodError if the JSON value is an empty string', () => {
      const json = '';

      try {
        ResponseCode.fromJSON(json);
        expect.fail('Expected a ZodError to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ZodError);
        expect(error instanceof ZodError && error.issues).toEqual([
          {
            code: 'too_small',
            exact: false,
            minimum: 1,
            type: 'string',
            inclusive: true,
            message: 'String must contain at least 1 character(s)',
            path: [],
          },
        ]);
      }
    });

    it('should throw a ZodError if the JSON value is not a string', () => {
      const json = 123;

      try {
        ResponseCode.fromJSON(json as any);
        expect.fail('Expected a ZodError to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ZodError);
        expect(error instanceof ZodError && error.issues).toEqual([
          {
            code: 'invalid_type',
            expected: 'string',
            received: 'number',
            message: 'Expected string, received number',
            path: [],
          },
        ]);
      }
    });
  });

  describe('toJSON', () => {
    it('should return the JSON representation of the ResponseCode', () => {
      const value = 'example_code';
      const responseCode = new ResponseCode(value);
      expect(responseCode.toJSON()).toBe(value);
    });
  });
});
