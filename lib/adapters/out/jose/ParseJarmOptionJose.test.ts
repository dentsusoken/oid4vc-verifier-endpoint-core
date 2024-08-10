import { describe, it, expect } from 'vitest';
import { createParseJarmOptionJoseInvoker } from './ParseJarmOptionJose';
import { JarmOption } from '../../../domain';

describe('createParseJarmOptionJoseInvoker', () => {
  const parseJarmOption = createParseJarmOptionJoseInvoker();

  it('should create a function', () => {
    expect(typeof parseJarmOption).toBe('function');
  });

  describe('parseJarmOption', () => {
    it('should return null when all parameters are null', () => {
      const result = parseJarmOption(null, null, null);
      expect(result).toBeNull();
    });

    it('should return Signed option when only JWS algorithm is provided', () => {
      const result = parseJarmOption('ES256', null, null);
      expect(result).toBeInstanceOf(JarmOption.Signed);
      expect(result?.jwsAlg()).toBe('ES256');
      expect(result?.jweAlg()).toBeUndefined();
      expect(result?.jweEnc()).toBeUndefined;
    });

    it('should return Encrypted option when JWE algorithm and encryption method are provided', () => {
      const result = parseJarmOption(null, 'ECDH-ES+A256KW', 'A256GCM');
      expect(result).toBeInstanceOf(JarmOption.Encrypted);
      expect(result?.jwsAlg()).toBeUndefined;
      expect(result?.jweAlg()).toBe('ECDH-ES+A256KW');
      expect(result?.jweEnc()).toBe('A256GCM');
    });

    it('should return SignedAndEncrypted option when all parameters are provided', () => {
      const result = parseJarmOption('ES256', 'ECDH-ES+A256KW', 'A256GCM');
      expect(result).toBeInstanceOf(JarmOption.SignedAndEncrypted);
      expect(result?.jwsAlg()).toBe('ES256');
      expect(result?.jweAlg()).toBe('ECDH-ES+A256KW');
      expect(result?.jweEnc()).toBe('A256GCM');
    });

    it('should throw an error when JWE algorithm is provided without encryption method', () => {
      expect(() => parseJarmOption(null, 'ECDH-ES+A256KW', null)).toThrow(
        'Encryption method must be provided with JWE algorithm'
      );
    });

    it('should throw an error when encryption method is provided without JWE algorithm', () => {
      expect(() => parseJarmOption(null, null, 'A256GCM')).toThrow(
        'JWE algorithm must be provided with Encryption method'
      );
    });

    it('should throw an error for invalid JWS algorithm', () => {
      expect(() => parseJarmOption('INVALID_ALG', null, null)).toThrow(
        'Invalid JWS alg: INVALID_ALG'
      );
    });

    it('should throw an error for invalid JWE algorithm', () => {
      expect(() => parseJarmOption(null, 'INVALID_ALG', 'A256GCM')).toThrow(
        'Invalid JWE alg: INVALID_ALG'
      );
    });

    it('should throw an error for invalid encryption method', () => {
      expect(() =>
        parseJarmOption(null, 'ECDH-ES+A256KW', 'INVALID_ENC')
      ).toThrow('Invalid JWE enc: INVALID_ENC');
    });

    it('should trim input strings', () => {
      const result = parseJarmOption(
        ' ES256 ',
        ' ECDH-ES+A256KW ',
        ' A256GCM '
      );
      expect(result).toBeInstanceOf(JarmOption.SignedAndEncrypted);
      expect(result?.jwsAlg()).toBe('ES256');
      expect(result?.jweAlg()).toBe('ECDH-ES+A256KW');
      expect(result?.jweEnc()).toBe('A256GCM');
    });
  });
});
