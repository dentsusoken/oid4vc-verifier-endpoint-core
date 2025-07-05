import { describe, it, expect } from 'vitest';
import { parseJarmOption } from '../ParseJarmOptionJose';
import { JarmOption } from '../../../../domain';

describe('createParseJarmOptionJoseInvoker', () => {
  it('should create a function', () => {
    expect(typeof parseJarmOption).toBe('function');
  });

  describe('parseJarmOption', () => {
    it('should return undefined when all parameters are null', () => {
      const result = parseJarmOption(undefined, undefined, undefined);
      expect(result).toBeUndefined();
    });

    it('should return Signed option when only JWS algorithm is provided', () => {
      const result = parseJarmOption('ES256', undefined, undefined);
      expect(result).toBeInstanceOf(JarmOption.Signed);
      expect(result?.jwsAlg()).toBe('ES256');
      expect(result?.jweAlg()).toBeUndefined();
      expect(result?.jweEnc()).toBeUndefined;
    });

    it('should return Encrypted option when JWE algorithm and encryption method are provided', () => {
      const result = parseJarmOption(undefined, 'ECDH-ES+A256KW', 'A256GCM');
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
      expect(() =>
        parseJarmOption(undefined, 'ECDH-ES+A256KW', undefined)
      ).toThrow('Encryption method must be provided with JWE algorithm');
    });

    it('should throw an error when encryption method is provided without JWE algorithm', () => {
      expect(() => parseJarmOption(undefined, undefined, 'A256GCM')).toThrow(
        'JWE algorithm must be provided with Encryption method'
      );
    });

    it('should throw an error for invalid JWS algorithm', () => {
      expect(() =>
        parseJarmOption('INVALID_ALG', undefined, undefined)
      ).toThrow('Invalid JWS alg: INVALID_ALG');
    });

    it('should throw an error for invalid JWE algorithm', () => {
      expect(() =>
        parseJarmOption(undefined, 'INVALID_ALG', 'A256GCM')
      ).toThrow('Invalid JWE alg: INVALID_ALG');
    });

    it('should throw an error for invalid encryption method', () => {
      expect(() =>
        parseJarmOption(undefined, 'ECDH-ES+A256KW', 'INVALID_ENC')
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
