import { describe, it, expect } from 'vitest';
import { JarmOption } from './JarmOption';

describe('JarmOption', () => {
  describe('Signed', () => {
    it('should have the correct __type', () => {
      const algorithm = 'RS256';
      const signed = new JarmOption.Signed(algorithm);
      expect(signed.__type).toBe('Signed');
    });

    it('should store the algorithm', () => {
      const algorithm = 'RS256';
      const signed = new JarmOption.Signed(algorithm);
      expect(signed.algorithm).toBe(algorithm);
    });

    it('should return the correct JWS algorithm', () => {
      const algorithm = 'RS256';
      const signed = new JarmOption.Signed(algorithm);
      expect(signed.jwsAlg()).toBe(algorithm);
    });

    it('should return undefined for JWE algorithm and encryption method', () => {
      const algorithm = 'RS256';
      const signed = new JarmOption.Signed(algorithm);
      expect(signed.jweAlg()).toBeUndefined();
      expect(signed.jweEnc()).toBeUndefined();
    });
  });

  describe('Encrypted', () => {
    it('should have the correct __type', () => {
      const algorithm = 'RSA-OAEP';
      const encMethod = 'A256GCM';
      const encrypted = new JarmOption.Encrypted(algorithm, encMethod);
      expect(encrypted.__type).toBe('Encrypted');
    });

    it('should store the algorithm and encryption method', () => {
      const algorithm = 'RSA-OAEP';
      const encMethod = 'A256GCM';
      const encrypted = new JarmOption.Encrypted(algorithm, encMethod);
      expect(encrypted.algorithm).toBe(algorithm);
      expect(encrypted.encMethod).toBe(encMethod);
    });

    it('should return the correct JWE algorithm and encryption method', () => {
      const algorithm = 'RSA-OAEP';
      const encMethod = 'A256GCM';
      const encrypted = new JarmOption.Encrypted(algorithm, encMethod);
      expect(encrypted.jweAlg()).toBe(algorithm);
      expect(encrypted.jweEnc()).toBe(encMethod);
    });

    it('should return undefined for JWS algorithm', () => {
      const algorithm = 'RSA-OAEP';
      const encMethod = 'A256GCM';
      const encrypted = new JarmOption.Encrypted(algorithm, encMethod);
      expect(encrypted.jwsAlg()).toBeUndefined();
    });
  });

  describe('SignedAndEncrypted', () => {
    it('should have the correct __type', () => {
      const signedAlgorithm = 'RS256';
      const encryptedAlgorithm = 'RSA-OAEP';
      const encMethod = 'A256GCM';
      const signed = new JarmOption.Signed(signedAlgorithm);
      const encrypted = new JarmOption.Encrypted(encryptedAlgorithm, encMethod);
      const signedAndEncrypted = new JarmOption.SignedAndEncrypted(
        signed,
        encrypted
      );
      expect(signedAndEncrypted.__type).toBe('SignedAndEncrypted');
    });

    it('should store the signed and encrypted options', () => {
      const signedAlgorithm = 'RS256';
      const encryptedAlgorithm = 'RSA-OAEP';
      const encMethod = 'A256GCM';
      const signed = new JarmOption.Signed(signedAlgorithm);
      const encrypted = new JarmOption.Encrypted(encryptedAlgorithm, encMethod);
      const signedAndEncrypted = new JarmOption.SignedAndEncrypted(
        signed,
        encrypted
      );
      expect(signedAndEncrypted.signed).toBe(signed);
      expect(signedAndEncrypted.encrypted).toBe(encrypted);
    });

    it('should return the correct JWS algorithm, JWE algorithm, and encryption method', () => {
      const signedAlgorithm = 'RS256';
      const encryptedAlgorithm = 'RSA-OAEP';
      const encMethod = 'A256GCM';
      const signed = new JarmOption.Signed(signedAlgorithm);
      const encrypted = new JarmOption.Encrypted(encryptedAlgorithm, encMethod);
      const signedAndEncrypted = new JarmOption.SignedAndEncrypted(
        signed,
        encrypted
      );
      expect(signedAndEncrypted.jwsAlg()).toBe(signedAlgorithm);
      expect(signedAndEncrypted.jweAlg()).toBe(encryptedAlgorithm);
      expect(signedAndEncrypted.jweEnc()).toBe(encMethod);
    });
  });

  describe('type guard', () => {
    it('should correctly identify Signed using if statement', () => {
      const algorithm = 'RS256';
      const jarmOption: JarmOption = new JarmOption.Signed(algorithm);

      if (jarmOption.__type === 'Signed') {
        expect(jarmOption.algorithm).toBe(algorithm);
      } else {
        throw new Error('Expected jarmOption to be of type Signed');
      }
    });

    it('should correctly identify Encrypted using if statement', () => {
      const algorithm = 'RSA-OAEP';
      const encMethod = 'A256GCM';
      const jarmOption: JarmOption = new JarmOption.Encrypted(
        algorithm,
        encMethod
      );

      if (jarmOption.__type === 'Encrypted') {
        expect(jarmOption.algorithm).toBe(algorithm);
        expect(jarmOption.encMethod).toBe(encMethod);
      } else {
        throw new Error('Expected jarmOption to be of type Encrypted');
      }
    });

    it('should correctly identify SignedAndEncrypted using if statement', () => {
      const signedAlgorithm = 'RS256';
      const encryptedAlgorithm = 'RSA-OAEP';
      const encMethod = 'A256GCM';
      const signed = new JarmOption.Signed(signedAlgorithm);
      const encrypted = new JarmOption.Encrypted(encryptedAlgorithm, encMethod);
      const jarmOption: JarmOption = new JarmOption.SignedAndEncrypted(
        signed,
        encrypted
      );

      if (jarmOption.__type === 'SignedAndEncrypted') {
        expect(jarmOption.signed).toBe(signed);
        expect(jarmOption.encrypted).toBe(encrypted);
      } else {
        throw new Error('Expected jarmOption to be of type SignedAndEncrypted');
      }
    });

    it('should correctly identify Signed using switch statement', () => {
      const algorithm = 'RS256';
      const jarmOption: JarmOption = new JarmOption.Signed(algorithm);

      switch (jarmOption.__type) {
        case 'Signed':
          expect(jarmOption.algorithm).toBe(algorithm);
          break;
        default:
          throw new Error('Expected jarmOption to be of type Signed');
      }
    });

    it('should correctly identify Encrypted using switch statement', () => {
      const algorithm = 'RSA-OAEP';
      const encMethod = 'A256GCM';
      const jarmOption: JarmOption = new JarmOption.Encrypted(
        algorithm,
        encMethod
      );

      switch (jarmOption.__type) {
        case 'Encrypted':
          expect(jarmOption.algorithm).toBe(algorithm);
          expect(jarmOption.encMethod).toBe(encMethod);
          break;
        default:
          throw new Error('Expected jarmOption to be of type Encrypted');
      }
    });

    it('should correctly identify SignedAndEncrypted using switch statement', () => {
      const signedAlgorithm = 'RS256';
      const encryptedAlgorithm = 'RSA-OAEP';
      const encMethod = 'A256GCM';
      const signed = new JarmOption.Signed(signedAlgorithm);
      const encrypted = new JarmOption.Encrypted(encryptedAlgorithm, encMethod);
      const jarmOption: JarmOption = new JarmOption.SignedAndEncrypted(
        signed,
        encrypted
      );

      switch (jarmOption.__type) {
        case 'SignedAndEncrypted':
          expect(jarmOption.signed).toBe(signed);
          expect(jarmOption.encrypted).toBe(encrypted);
          break;
        default:
          throw new Error(
            'Expected jarmOption to be of type SignedAndEncrypted'
          );
      }
    });
  });
});
