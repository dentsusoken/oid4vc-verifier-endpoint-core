import { describe, it, expect } from 'vitest';
import {
  ResponseModeOption,
  responseModeOptionSchema,
} from '../ResponseModeOption';
import { ZodError } from 'zod';

describe('ResponseModeOption', () => {
  describe('namespace constants', () => {
    it('should have the correct value for DirectPost', () => {
      expect(ResponseModeOption.DirectPost).toBe('direct_post');
    });

    it('should have the correct value for DirectPostJwt', () => {
      expect(ResponseModeOption.DirectPostJwt).toBe('direct_post.jwt');
    });
  });
});

describe('responseModeOptionSchema', () => {
  it('should accept valid ResponseModeOption values', () => {
    expect(responseModeOptionSchema.parse('direct_post')).toBe('direct_post');
    expect(responseModeOptionSchema.parse('direct_post.jwt')).toBe(
      'direct_post.jwt'
    );
  });

  it('should throw a ZodError for invalid values', () => {
    expect(() => responseModeOptionSchema.parse('invalid')).toThrow(ZodError);
    expect(() => responseModeOptionSchema.parse('')).toThrow(ZodError);
    expect(() => responseModeOptionSchema.parse(123)).toThrow(ZodError);
    expect(() =>
      responseModeOptionSchema.parse(null as unknown as string)
    ).toThrow(ZodError);
    expect(() =>
      responseModeOptionSchema.parse(undefined as unknown as string)
    ).toThrow(ZodError);
  });
});

describe('ResponseModeOption type', () => {
  it('should be assignable to valid values', () => {
    const directPost: ResponseModeOption = 'direct_post';
    const directPostJwt: ResponseModeOption = 'direct_post.jwt';

    expect(directPost).toBe('direct_post');
    expect(directPostJwt).toBe('direct_post.jwt');
  });

  // it('should not be assignable to invalid values', () => {
  //   const invalidValue: ResponseModeOption = 'invalid';

  //   // This test will always pass at runtime, but it checks for TypeScript compilation errors
  //   expect(true).toBe(true);
  // });
});
