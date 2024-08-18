import { describe, it, expect } from 'vitest';
import { IdTokenType } from './IdTokenType';
import { ZodError } from 'zod';

describe('IdTokenType', () => {
  describe('toJSON', () => {
    it('should return the string representation of SubjectSigned', () => {
      const result = IdTokenType.toJSON(IdTokenType.SubjectSigned);
      expect(result).toBe('subject_signed_id_token');
    });

    it('should return the string representation of AttesterSigned', () => {
      const result = IdTokenType.toJSON(IdTokenType.AttesterSigned);
      expect(result).toBe('attester_signed_id_token');
    });
  });

  describe('fromJSON', () => {
    it('should return SubjectSigned for "subject_signed_id_token"', () => {
      const result = IdTokenType.fromJSON('subject_signed_id_token');
      expect(result).toBe(IdTokenType.SubjectSigned);
    });

    it('should return AttesterSigned for "attester_signed_id_token"', () => {
      const result = IdTokenType.fromJSON('attester_signed_id_token');
      expect(result).toBe(IdTokenType.AttesterSigned);
    });

    it('should throw a ZodError with the expected error details for an invalid JSON value', () => {
      const invalidValue = 'invalid_value';

      try {
        IdTokenType.fromJSON(invalidValue);
        expect.fail('Expected a ZodError to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ZodError);
        expect(error instanceof ZodError && error.issues).toEqual([
          {
            received: invalidValue,
            code: 'invalid_enum_value',
            options: [IdTokenType.SubjectSigned, IdTokenType.AttesterSigned],
            path: [],
            message: `Invalid enum value. Expected '${IdTokenType.SubjectSigned}' | '${IdTokenType.AttesterSigned}', received '${invalidValue}'`,
          },
        ]);
      }
    });
  });
});
