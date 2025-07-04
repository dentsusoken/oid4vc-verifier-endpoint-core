import { describe, it, expect } from 'vitest';
import {
  EphemeralECDHPrivateJwk,
  ephemeralECDHPrivateJwkSchema,
} from '../EphemeralECDHPrivateJwk';
import { ZodError } from 'zod';

describe('EphemeralECDHPrivateJwk', () => {
  const validJwk =
    '{"kty":"EC","crv":"P-256","x":"example-x","y":"example-y","d":"example-d"}';

  describe('constructor', () => {
    it('should create an instance with a valid value', () => {
      const jwk = new EphemeralECDHPrivateJwk(validJwk);
      expect(jwk.value).toBe(validJwk);
    });

    it('should accept an invalid JSON string without throwing an error', () => {
      expect(() => new EphemeralECDHPrivateJwk('invalid')).not.toThrow();
    });
  });

  describe('toJSON', () => {
    it('should return the value as a string', () => {
      const jwk = new EphemeralECDHPrivateJwk(validJwk);
      expect(jwk.toJSON()).toBe(validJwk);
    });

    it('should work with JSON.stringify', () => {
      const jwk = new EphemeralECDHPrivateJwk(validJwk);
      expect(JSON.stringify({ jwk })).toBe(
        `{"jwk":${JSON.stringify(validJwk)}}`
      );
    });
  });
});

describe('ephemeralECDHPrivateJwkSchema', () => {
  const validJwk =
    '{"kty":"EC","crv":"P-256","x":"example-x","y":"example-y","d":"example-d"}';

  it('should accept valid JWK strings', () => {
    expect(ephemeralECDHPrivateJwkSchema.parse(validJwk)).toBe(validJwk);
  });

  it('should throw a ZodError for an invalid JSON string', () => {
    expect(() => ephemeralECDHPrivateJwkSchema.parse('invalid')).toThrow(
      ZodError
    );
  });

  it('should throw a ZodError for a JSON string missing required properties', () => {
    const invalidJwk = '{"kty":"EC","crv":"P-256"}'; // missing x, y, and d
    expect(() => ephemeralECDHPrivateJwkSchema.parse(invalidJwk)).toThrow(
      ZodError
    );
  });

  it('should throw a ZodError for non-string values', () => {
    expect(() =>
      ephemeralECDHPrivateJwkSchema.parse(123 as unknown as string)
    ).toThrow(ZodError);
    expect(() =>
      ephemeralECDHPrivateJwkSchema.parse(null as unknown as string)
    ).toThrow(ZodError);
    expect(() =>
      ephemeralECDHPrivateJwkSchema.parse(undefined as unknown as string)
    ).toThrow(ZodError);
    expect(() =>
      ephemeralECDHPrivateJwkSchema.parse({} as unknown as string)
    ).toThrow(ZodError);
  });

  it('should provide the correct error message for invalid input', () => {
    try {
      ephemeralECDHPrivateJwkSchema.parse('invalid');
    } catch (error) {
      expect(error).toBeInstanceOf(ZodError);
      expect(error instanceof ZodError && error.issues[0].message).toBe(
        'Must be a valid JSON string representing a JWK with kty, crv, x, y, and d properties'
      );
    }
  });
});
