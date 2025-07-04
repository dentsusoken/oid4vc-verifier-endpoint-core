import { describe, it, expect } from 'vitest';
import { ResponseCode, responseCodeSchema } from '../ResponseCode';
import { ZodError } from 'zod';

describe('ResponseCode', () => {
  describe('constructor', () => {
    it('should create an instance with a valid value', () => {
      const code = new ResponseCode('ABC123');
      expect(code.value).toBe('ABC123');
    });

    it('should throw a ZodError if value is empty', () => {
      expect(() => new ResponseCode('')).toThrow(Error);
    });

    it('should throw a ZodError if value is too short', () => {
      expect(() => new ResponseCode('')).toThrow(Error);
    });
  });

  describe('toJSON', () => {
    it('should return the value as a string', () => {
      const code = new ResponseCode('ABC123');
      expect(code.toJSON()).toBe('ABC123');
    });

    it('should work with JSON.stringify', () => {
      const code = new ResponseCode('ABC123');
      expect(JSON.stringify({ code })).toBe('{"code":"ABC123"}');
    });
  });
});

describe('responseCodeSchema', () => {
  it('should accept valid strings', () => {
    expect(responseCodeSchema.parse('A')).toBe('A');
    expect(responseCodeSchema.parse('ABC123')).toBe('ABC123');
  });

  it('should throw a ZodError for an empty string', () => {
    expect(() => responseCodeSchema.parse('')).toThrow(ZodError);
  });

  it('should throw a ZodError for non-string values', () => {
    expect(() => responseCodeSchema.parse(123 as unknown as string)).toThrow(
      ZodError
    );
    expect(() => responseCodeSchema.parse(null as unknown as string)).toThrow(
      ZodError
    );
    expect(() =>
      responseCodeSchema.parse(undefined as unknown as string)
    ).toThrow(ZodError);
    expect(() => responseCodeSchema.parse({} as unknown as string)).toThrow(
      ZodError
    );
  });
});
