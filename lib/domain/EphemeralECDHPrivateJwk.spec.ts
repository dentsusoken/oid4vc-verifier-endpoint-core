import { describe, it, expect } from 'vitest';
import { EphemeralECDHPrivateJwk } from './EphemeralECDHPrivateJwk';
import { ZodError } from 'zod';

describe('EphemeralECDHPrivateJwk', () => {
  describe('fromJSON', () => {
    it('should create an EphemeralECDHPrivateJwk instance from a valid JSON string', () => {
      const json = '{"kty":"EC","crv":"P-256","x":"abc","y":"def","d":"ghi"}';
      const result = EphemeralECDHPrivateJwk.fromJSON(json);
      expect(result).toEqual({ value: json });
    });

    it('should throw a ZodError with the expected error details for an invalid JSON value', () => {
      const invalidValue = '';

      try {
        EphemeralECDHPrivateJwk.fromJSON(invalidValue);
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
  });

  describe('toJSON', () => {
    it('should return the string representation of the EphemeralECDHPrivateJwk value', () => {
      const value = '{"kty":"EC","crv":"P-256","x":"abc","y":"def","d":"ghi"}';
      const ephemeralECDHPrivateJwk: EphemeralECDHPrivateJwk = { value };
      const result = EphemeralECDHPrivateJwk.toJSON(ephemeralECDHPrivateJwk);
      expect(result).toEqual(value);
    });
  });
});
