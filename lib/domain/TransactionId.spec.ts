import { describe, it, expect } from 'vitest';
import { TransactionId, transactionIdSchema } from './TransactionId';
import { ZodError } from 'zod';

describe('TransactionId', () => {
  describe('constructor', () => {
    it('should create an instance with a valid value', () => {
      const id = new TransactionId('abc123');
      expect(id.value).toBe('abc123');
    });

    it('should throw an error if value is empty', () => {
      expect(() => new TransactionId('')).toThrow('value is required');
    });

    it('should throw an error if value is null', () => {
      expect(() => new TransactionId(null as unknown as string)).toThrow(
        'value is required'
      );
    });

    it('should throw an error if value is undefined', () => {
      expect(() => new TransactionId(undefined as unknown as string)).toThrow(
        'value is required'
      );
    });
  });

  describe('toJSON', () => {
    it('should return the value as a string', () => {
      const id = new TransactionId('abc123');
      expect(id.toJSON()).toBe('abc123');
    });

    it('should work with JSON.stringify', () => {
      const id = new TransactionId('abc123');
      expect(JSON.stringify({ id })).toBe('{"id":"abc123"}');
    });
  });
});

describe('transactionIdSchema', () => {
  it('should accept valid strings', () => {
    expect(transactionIdSchema.parse('a')).toBe('a');
    expect(transactionIdSchema.parse('abc123')).toBe('abc123');
  });

  it('should throw a ZodError for an empty string', () => {
    expect(() => transactionIdSchema.parse('')).toThrow(ZodError);
  });

  it('should throw a ZodError for non-string values', () => {
    expect(() => transactionIdSchema.parse(123 as unknown as string)).toThrow(
      ZodError
    );
    expect(() => transactionIdSchema.parse(null as unknown as string)).toThrow(
      ZodError
    );
    expect(() =>
      transactionIdSchema.parse(undefined as unknown as string)
    ).toThrow(ZodError);
    expect(() => transactionIdSchema.parse({} as unknown as string)).toThrow(
      ZodError
    );
  });
});
