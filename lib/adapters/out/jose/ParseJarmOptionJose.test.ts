import { describe, it, expect } from 'vitest';
import { createParseJarmOptionJoseInvoker } from './ParseJarmOptionJose';
import { JarmOption } from '../../../domain';

describe('ParseJarmOptionJose', () => {
  const parseJarmOption = createParseJarmOptionJoseInvoker();

  describe('jwsAlgOf', () => {
    it('should return valid JWS algorithms', () => {
      expect(parseJarmOption('RS256', null, null)).toEqual(
        new JarmOption.Signed('RS256')
      );
      expect(parseJarmOption('  RS256  ', ' ', ' ')).toEqual(
        new JarmOption.Signed('RS256')
      );
      expect(parseJarmOption('ES256', null, null)).toEqual(
        new JarmOption.Signed('ES256')
      );
    });

    it('should throw an error for invalid JWS algorithms', () => {
      expect(() => parseJarmOption('xx256', null, null)).toThrow(
        'Invalid JWS alg: xx256'
      );
    });
  });

  describe('jweAlgOf', () => {
    it('should return valid JWE algorithms', () => {
      expect(parseJarmOption(null, 'ECDH-ES', 'A128CBC-HS256')).toEqual(
        new JarmOption.Encrypted('ECDH-ES', 'A128CBC-HS256')
      );
      expect(parseJarmOption(' ', ' ECDH-ES ', ' A128CBC-HS256 ')).toEqual(
        new JarmOption.Encrypted('ECDH-ES', 'A128CBC-HS256')
      );
    });

    it('should throw an error for invalid JWE algorithms', () => {
      expect(() => parseJarmOption(null, 'RSA-xxx', 'A128CBC-HS256')).toThrow(
        'Invalid JWE alg: RSA-xxx'
      );
    });
  });

  describe('encMethodOf', () => {
    it('should return valid encryption methods', () => {
      expect(parseJarmOption(null, 'ECDH-ES', 'A128CBC-HS256')).toEqual(
        new JarmOption.Encrypted('ECDH-ES', 'A128CBC-HS256')
      );
    });

    it('should throw an error for invalid encryption methods', () => {
      expect(() => parseJarmOption(null, 'ECDH-ES', 'A256xxx')).toThrow(
        'Invalid JWE enc: A256xxx'
      );
    });
  });

  describe('invoke', () => {
    it('should return Signed JarmOption for valid JWS algorithm', () => {
      const result = parseJarmOption('RS256', null, null);
      expect(result).toEqual(new JarmOption.Signed('RS256'));
    });

    it('should return Encrypted JarmOption for valid JWE algorithm and encryption method', () => {
      const result = parseJarmOption(null, 'ECDH-ES', 'A128CBC-HS256');
      expect(result).toEqual(
        new JarmOption.Encrypted('ECDH-ES', 'A128CBC-HS256')
      );
    });

    it('should return SignedAndEncrypted JarmOption when both JWS and JWE algorithms are provided', () => {
      const result = parseJarmOption('RS256', 'ECDH-ES', 'A128CBC-HS256');
      expect(result).toEqual(
        new JarmOption.SignedAndEncrypted(
          new JarmOption.Signed('RS256'),
          new JarmOption.Encrypted('ECDH-ES', 'A128CBC-HS256')
        )
      );
    });

    it('should throw an error when neither JWS nor JWE algorithm is provided', () => {
      expect(parseJarmOption(null, null, null)).toBeNull();
    });

    it('should throw an error when JWE algorithm is provided without encryption method', () => {
      expect(() => parseJarmOption(null, 'ECDH-ES', null)).toThrow(
        'Encryption method must be provided with JWE algorithm'
      );
    });

    it('should throw an error when encryption method is provided without JWE algorithm', () => {
      expect(() => parseJarmOption(null, null, 'A128CBC-HS256')).toThrow(
        'JWE algorithm must be provided with Encryption method'
      );
    });
  });
});
