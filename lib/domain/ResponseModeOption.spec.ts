import { describe, it, expect } from 'vitest';
import { ResponseModeOption } from './ResponseModeOption';
import { ZodError } from 'zod';

describe('ResponseModeOption', () => {
  describe('fromJSON', () => {
    it('should parse a valid ResponseModeOption value from JSON', () => {
      expect(ResponseModeOption.fromJSON('direct_post')).toBe(
        ResponseModeOption.DirectPost
      );
      expect(ResponseModeOption.fromJSON('direct_post.jwt')).toBe(
        ResponseModeOption.DirectPostJwt
      );
    });

    it('should throw a ZodError for an invalid ResponseModeOption value', () => {
      const invalidValue = 'invalid_mode';

      try {
        ResponseModeOption.fromJSON(invalidValue);
        expect.fail('Expected a ZodError to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ZodError);
        expect(error instanceof ZodError && error.issues).toEqual([
          {
            code: 'invalid_enum_value',
            options: [
              ResponseModeOption.DirectPost,
              ResponseModeOption.DirectPostJwt,
            ],
            message: `Invalid enum value. Expected 'direct_post' | 'direct_post.jwt', received '${invalidValue}'`,
            path: [],
            received: invalidValue,
          },
        ]);
      }
    });
  });

  describe('toJSON', () => {
    it('should convert a ResponseModeOption value to its JSON representation', () => {
      expect(ResponseModeOption.toJSON(ResponseModeOption.DirectPost)).toBe(
        'direct_post'
      );
      expect(ResponseModeOption.toJSON(ResponseModeOption.DirectPostJwt)).toBe(
        'direct_post.jwt'
      );
    });
  });
});
