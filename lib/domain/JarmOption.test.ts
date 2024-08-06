import { describe, it, expect } from 'vitest';
import { JarmOptionNS } from './JarmOption';

describe('JarmOption', () => {
  describe('Signed', () => {
    it('should create an instance of Signed with the provided algorithm', () => {
      const algorithm = 'RS256';
      const signed = new JarmOptionNS.Signed(algorithm);
      expect(signed.algorithm).toBe(algorithm);
    });

    it('should return the correct JWS algorithm', () => {
      const algorithm = 'RS256';
      const signed = new JarmOptionNS.Signed(algorithm);
      expect(signed.jwsAlg()).toBe(algorithm);
    });

    it('should return null for JWE algorithm and encryption method', () => {
      const signed = new JarmOptionNS.Signed('RS256');
      expect(signed.jweAlg()).toBeUndefined();
      expect(signed.jweEnc()).toBeUndefined();
    });
  });

  describe('Encrypted', () => {
    it('should create an instance of Encrypted with the provided algorithm and encode', () => {
      const algorithm = 'RSA-OAEP';
      const encode = 'A256GCM';
      const encrypted = new JarmOptionNS.Encrypted(algorithm, encode);
      expect(encrypted.algorithm).toBe(algorithm);
      expect(encrypted.encMethod).toBe(encode);
    });

    it('should return the correct JWE algorithm and encryption method', () => {
      const algorithm = 'RSA-OAEP';
      const encode = 'A256GCM';
      const encrypted = new JarmOptionNS.Encrypted(algorithm, encode);
      expect(encrypted.jweAlg()).toBe(algorithm);
      expect(encrypted.jweEnc()).toBe(encode);
    });

    it('should return null for JWS algorithm', () => {
      const encrypted = new JarmOptionNS.Encrypted('RSA-OAEP', 'A256GCM');
      expect(encrypted.jwsAlg()).toBeUndefined();
    });
  });

  describe('SignedAndEncrypted', () => {
    it('should create an instance of SignedAndEncrypted with the provided signed and encrypted options', () => {
      const signed = new JarmOptionNS.Signed('RS256');
      const encrypted = new JarmOptionNS.Encrypted('RSA-OAEP', 'A256GCM');
      const signedAndEncrypted = new JarmOptionNS.SignedAndEncrypted(
        signed,
        encrypted
      );
      expect(signedAndEncrypted.signed).toBe(signed);
      expect(signedAndEncrypted.encrypted).toBe(encrypted);
    });

    it('should return the correct JWS algorithm, JWE algorithm, and encryption method', () => {
      const signed = new JarmOptionNS.Signed('RS256');
      const encrypted = new JarmOptionNS.Encrypted('RSA-OAEP', 'A256GCM');
      const signedAndEncrypted = new JarmOptionNS.SignedAndEncrypted(
        signed,
        encrypted
      );
      expect(signedAndEncrypted.jwsAlg()).toBe(signed.algorithm);
      expect(signedAndEncrypted.jweAlg()).toBe(encrypted.algorithm);
      expect(signedAndEncrypted.jweEnc()).toBe(encrypted.encMethod);
    });
  });

  describe('Type Guards', () => {
    it('should correctly identify an instance of Signed', () => {
      const signed = new JarmOptionNS.Signed('RS256');
      expect(JarmOptionNS.isSigned(signed)).toBe(true);
      expect(JarmOptionNS.isEncrypted(signed)).toBe(false);
      expect(JarmOptionNS.isSignedAndEncrypted(signed)).toBe(false);
    });

    it('should correctly identify an instance of Encrypted', () => {
      const encrypted = new JarmOptionNS.Encrypted('RSA-OAEP', 'A256GCM');
      expect(JarmOptionNS.isSigned(encrypted)).toBe(false);
      expect(JarmOptionNS.isEncrypted(encrypted)).toBe(true);
      expect(JarmOptionNS.isSignedAndEncrypted(encrypted)).toBe(false);
    });

    it('should correctly identify an instance of SignedAndEncrypted', () => {
      const signed = new JarmOptionNS.Signed('RS256');
      const encrypted = new JarmOptionNS.Encrypted('RSA-OAEP', 'A256GCM');
      const signedAndEncrypted = new JarmOptionNS.SignedAndEncrypted(
        signed,
        encrypted
      );
      expect(JarmOptionNS.isSigned(signedAndEncrypted)).toBe(false);
      expect(JarmOptionNS.isEncrypted(signedAndEncrypted)).toBe(false);
      expect(JarmOptionNS.isSignedAndEncrypted(signedAndEncrypted)).toBe(true);
    });
  });
});
