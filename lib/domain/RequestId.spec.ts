import { describe, it, expect } from 'vitest';
import { RequestId, requestIdScheme } from './RequestId';
import { ZodError } from 'zod';

describe('RequestId', () => {
  describe('constructor', () => {
    it('should create an instance with a valid value', () => {
      const id = new RequestId('req-123');
      expect(id.value).toBe('req-123');
    });

    it('should throw an error if value is empty', () => {
      expect(() => new RequestId('')).toThrow('value is required');
    });

    it('should throw an error if value is null', () => {
      expect(() => new RequestId(null as unknown as string)).toThrow(
        'value is required'
      );
    });

    it('should throw an error if value is undefined', () => {
      expect(() => new RequestId(undefined as unknown as string)).toThrow(
        'value is required'
      );
    });
  });

  describe('toJSON', () => {
    it('should return the value as a string', () => {
      const id = new RequestId('req-123');
      expect(id.toJSON()).toBe('req-123');
    });

    it('should work with JSON.stringify', () => {
      const id = new RequestId('req-123');
      expect(JSON.stringify({ id })).toBe('{"id":"req-123"}');
    });
  });
});

describe('requestIdScheme', () => {
  it('should accept valid strings', () => {
    expect(requestIdScheme.parse('a')).toBe('a');
    expect(requestIdScheme.parse('req-123')).toBe('req-123');
  });

  it('should throw a ZodError for an empty string', () => {
    expect(() => requestIdScheme.parse('')).toThrow(ZodError);
  });

  it('should throw a ZodError for non-string values', () => {
    expect(() => requestIdScheme.parse(123 as unknown as string)).toThrow(
      ZodError
    );
    expect(() => requestIdScheme.parse(null as unknown as string)).toThrow(
      ZodError
    );
    expect(() => requestIdScheme.parse(undefined as unknown as string)).toThrow(
      ZodError
    );
    expect(() => requestIdScheme.parse({} as unknown as string)).toThrow(
      ZodError
    );
  });
});
