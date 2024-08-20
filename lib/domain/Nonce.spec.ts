import { describe, it, expect } from 'vitest';
import { Nonce, nonceSchema } from './Nonce';
import { ZodError } from 'zod';

describe('Nonce', () => {
  describe('constructor', () => {
    it('should create an instance with a valid value', () => {
      const nonce = new Nonce('abc123');
      expect(nonce.value).toBe('abc123');
    });

    it('should throw an error if value is empty', () => {
      expect(() => new Nonce('')).toThrow('value is required');
    });

    it('should throw an error if value is null', () => {
      expect(() => new Nonce(null as unknown as string)).toThrow(
        'value is required'
      );
    });

    it('should throw an error if value is undefined', () => {
      expect(() => new Nonce(undefined as unknown as string)).toThrow(
        'value is required'
      );
    });
  });

  describe('toJSON', () => {
    it('should return the value as a string', () => {
      const nonce = new Nonce('abc123');
      expect(nonce.toJSON()).toBe('abc123');
    });

    it('should work with JSON.stringify', () => {
      const nonce = new Nonce('abc123');
      expect(JSON.stringify({ nonce })).toBe('{"nonce":"abc123"}');
    });
  });
});

describe('nonceSchema', () => {
  it('should accept valid strings', () => {
    expect(nonceSchema.parse('a')).toBe('a');
    expect(nonceSchema.parse('abc123')).toBe('abc123');
  });

  it('should throw a ZodError for an empty string', () => {
    expect(() => nonceSchema.parse('')).toThrow(ZodError);
  });

  it('should throw a ZodError for non-string values', () => {
    expect(() => nonceSchema.parse(123 as unknown as string)).toThrow(ZodError);
    expect(() => nonceSchema.parse(null as unknown as string)).toThrow(
      ZodError
    );
    expect(() => nonceSchema.parse(undefined as unknown as string)).toThrow(
      ZodError
    );
    expect(() => nonceSchema.parse({} as unknown as string)).toThrow(ZodError);
  });
});
