import { describe, it, expect } from 'vitest';
import { iso8601Schema } from './iso8601Schema';
import { ZodError } from 'zod';

describe('iso8601Schema', () => {
  describe('valid formats', () => {
    const validFormats = [
      '2024-08-19T14:30:00Z',
      '2024-08-19T14:30:00.123Z',
      '2024-08-19T14:30:00+09:00',
      '2024-08-19T14:30:00-05:30',
      '2024-08-19T14:30:00.999999Z',
      '2024-08-19T14:30:00',
    ];

    validFormats.forEach((format) => {
      it(`should accept ${format}`, () => {
        expect(iso8601Schema.parse(format)).toBe(format);
      });
    });
  });

  describe('invalid formats', () => {
    const invalidFormats = [
      '2024-08-19', // missing time
      '2024/08/19T14:30:00Z', // wrong date separator
      '2024-08-19 14:30:00Z', // space instead of T
      '2024-13-19T14:30:00Z', // invalid month
      '2024-08-32T14:30:00Z', // invalid day
      '2024-08-19T25:30:00Z', // invalid hour
      '2024-08-19T14:60:00Z', // invalid minute
      '2024-08-19T14:30:60Z', // invalid second
      '2024-08-19T14:30:00+24:00', // invalid timezone hour
      '2024-08-19T14:30:00+00:60', // invalid timezone minute
      '24-08-19T14:30:00Z', // year should be 4 digits
      '2024-8-19T14:30:00Z', // month should be 2 digits
      '2024-08-1T14:30:00Z', // day should be 2 digits
      '2024-08-19T1:30:00Z', // hour should be 2 digits
      '2024-08-19T14:3:00Z', // minute should be 2 digits
      '2024-08-19T14:30:0Z', // second should be 2 digits
      '', // empty string
      'invalid', // completely invalid string
    ];

    invalidFormats.forEach((format) => {
      it(`should reject ${format}`, () => {
        expect(() => iso8601Schema.parse(format)).toThrow(ZodError);
      });
    });
  });

  it('should provide correct error message for invalid format', () => {
    try {
      iso8601Schema.parse('invalid');
    } catch (error) {
      expect(error).toBeInstanceOf(ZodError);
      expect(error instanceof ZodError && error.issues[0].message).toBe(
        'Invalid ISO 8601 format'
      );
    }
  });

  it('should reject non-string values', () => {
    expect(() => iso8601Schema.parse(123)).toThrow(ZodError);
    expect(() => iso8601Schema.parse(null as unknown as string)).toThrow(
      ZodError
    );
    expect(() => iso8601Schema.parse(undefined as unknown as string)).toThrow(
      ZodError
    );
    expect(() => iso8601Schema.parse({})).toThrow(ZodError);
  });
});
