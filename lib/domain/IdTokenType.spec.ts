import { describe, it, expect } from 'vitest';
import { IdTokenType, idTokenTypeSchema } from './IdTokenType';
import { ZodError } from 'zod';

describe('IdTokenType', () => {
  describe('idTokenTypeSchema', () => {
    it('should accept valid IdTokenType values', () => {
      expect(idTokenTypeSchema.parse(IdTokenType.SubjectSigned)).toBe(
        IdTokenType.SubjectSigned
      );
      expect(idTokenTypeSchema.parse(IdTokenType.AttesterSigned)).toBe(
        IdTokenType.AttesterSigned
      );
    });

    it('should reject invalid values', () => {
      expect(() => idTokenTypeSchema.parse('invalid_value')).toThrow(ZodError);
      expect(() => idTokenTypeSchema.parse('')).toThrow(ZodError);
      expect(() => idTokenTypeSchema.parse(null)).toThrow(ZodError);
      expect(() => idTokenTypeSchema.parse(undefined)).toThrow(ZodError);
      expect(() => idTokenTypeSchema.parse(123)).toThrow(ZodError);
    });
  });

  describe('IdTokenType namespace', () => {
    it('should have correct values for SubjectSigned and AttesterSigned', () => {
      expect(IdTokenType.SubjectSigned).toBe('subject_signed_id_token');
      expect(IdTokenType.AttesterSigned).toBe('attester_signed_id_token');
    });

    it('should not have any additional properties', () => {
      const keys = Object.keys(IdTokenType);
      expect(keys).toHaveLength(2);
      expect(keys).toContain('SubjectSigned');
      expect(keys).toContain('AttesterSigned');
    });
  });

  describe('IdTokenType type', () => {
    it('should be assignable to valid values', () => {
      const subjectSigned: IdTokenType = IdTokenType.SubjectSigned;
      const attesterSigned: IdTokenType = IdTokenType.AttesterSigned;

      expect(subjectSigned).toBe(IdTokenType.SubjectSigned);
      expect(attesterSigned).toBe(IdTokenType.AttesterSigned);
    });

    // it('should not be assignable to invalid values', () => {
    //   const invalidValue: IdTokenType = 'invalid_value';

    //   expect(true).toBe(true);
    // });
  });
});
