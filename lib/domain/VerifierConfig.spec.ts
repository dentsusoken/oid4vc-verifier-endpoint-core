import { describe, expect, it, vi } from 'vitest';
import {
  ClientIdScheme,
  SigningConfig,
  JarmOption,
  EmbedOption,
} from './VerifierConfig';

describe('ClientIdScheme', () => {
  describe('PreRegistered', () => {
    it('should set the name property to "pre-registered"', () => {
      const clientId = 'client123';
      const jarSigning = new SigningConfig('{}', 'RS256');

      const scheme = new ClientIdScheme.PreRegistered(clientId, jarSigning);

      expect(scheme.name).toBe('pre-registered');
    });
  });

  describe('X509SanDns', () => {
    it('should set the name property to "x509_san_dns"', () => {
      const clientId = 'client123';
      const jarSigning = new SigningConfig('{}', 'RS256');
      //jarSigning.certificate().containsSanDns = vi.fn().mockReturnValue(true);

      const scheme = new ClientIdScheme.X509SanDns(clientId, jarSigning);

      expect(scheme.name).toBe('x509_san_dns');
      // expect(jarSigning.certificate().containsSanDns).toHaveBeenCalledWith(
      //   clientId
      // );
    });

    // it('should throw an error if clientId is not contained in DNS SAN', () => {
    //   const clientId = 'client123';
    //   const jarSigning = new SigningConfig(
    //     { parsedX509CertChain: [{}] },
    //     'hoge'
    //   );
    //   jarSigning.certificate().containsSanDns = vi.fn().mockReturnValue(false);

    //   expect(
    //     () => new ClientIdScheme.X509SanDns(clientId, jarSigning)
    //   ).toThrowError(
    //     "Client Id 'client123' not contained in 'DNS' Subject Alternative Names of JAR Signing Certificate."
    //   );
    //   expect(jarSigning.certificate().containsSanDns).toHaveBeenCalledWith(
    //     clientId
    //   );
    // });
  });

  describe('X509SanUri', () => {
    it('should set the name property to "x509_san_uri"', () => {
      const clientId = 'client123';
      const jarSigning = new SigningConfig('{}', 'RS256');
      //jarSigning.certificate().containsSanUri = vi.fn().mockReturnValue(true);

      const scheme = new ClientIdScheme.X509SanUri(clientId, jarSigning);

      expect(scheme.name).toBe('x509_san_uri');
      // expect(jarSigning.certificate().containsSanUri).toHaveBeenCalledWith(
      //   clientId
      // );
    });

    // it('should throw an error if clientId is not contained in URI SAN', () => {
    //   const clientId = 'client123';
    //   const jarSigning = new SigningConfig(
    //     { parsedX509CertChain: [{}] },
    //     'hoge'
    //   );
    //   jarSigning.certificate().containsSanUri = vi.fn().mockReturnValue(false);

    //   expect(
    //     () => new ClientIdScheme.X509SanUri(clientId, jarSigning)
    //   ).toThrowError(
    //     "Client Id 'client123' not contained in 'URI' Subject Alternative Names of JAR Signing Certificate."
    //   );
    //   expect(jarSigning.certificate().containsSanUri).toHaveBeenCalledWith(
    //     clientId
    //   );
    // });
  });
});

describe('JarmOption', () => {
  describe('Signed', () => {
    it('should return the algorithm for jwsAlg', () => {
      const algorithm = 'HS256';
      const signed = new JarmOption.Signed(algorithm);

      const result = signed.jwsAlg();

      expect(result).toBe(algorithm);
    });

    it('should return undefined for jweAlg', () => {
      const algorithm = 'HS256';
      const signed = new JarmOption.Signed(algorithm);

      const result = signed.jweAlg();

      expect(result).toBeUndefined();
    });

    it('should return undefined for encryptionMethod', () => {
      const algorithm = 'HS256';
      const signed = new JarmOption.Signed(algorithm);

      const result = signed.encryptionMethod();

      expect(result).toBeUndefined();
    });
  });

  describe('Encrypted', () => {
    it('should return undefined for jwsAlg', () => {
      const algorithm = 'RSA-OAEP';
      const encode = 'base64';
      const encrypted = new JarmOption.Encrypted(algorithm, encode);

      const result = encrypted.jwsAlg();

      expect(result).toBeUndefined();
    });

    it('should return the algorithm for jweAlg', () => {
      const algorithm = 'RSA-OAEP';
      const encode = 'base64';
      const encrypted = new JarmOption.Encrypted(algorithm, encode);

      const result = encrypted.jweAlg();

      expect(result).toBe(algorithm);
    });

    it('should return the encode for encryptionMethod', () => {
      const algorithm = 'RSA-OAEP';
      const encode = 'base64';
      const encrypted = new JarmOption.Encrypted(algorithm, encode);

      const result = encrypted.encryptionMethod();

      expect(result).toBe(encode);
    });
  });

  describe('SignedAndEncrypted', () => {
    it('should return the algorithm of signed for jwsAlg', () => {
      const signedAlgorithm = 'HS256';
      const encryptedAlgorithm = 'RSA-OAEP';
      const encode = 'base64';
      const signed = new JarmOption.Signed(signedAlgorithm);
      const encrypted = new JarmOption.Encrypted(encryptedAlgorithm, encode);
      const signedAndEncrypted = new JarmOption.SignedAndEncrypted(
        signed,
        encrypted
      );

      const result = signedAndEncrypted.jwsAlg();

      expect(result).toBe(signedAlgorithm);
    });

    it('should return the algorithm of encrypted for jweAlg', () => {
      const signedAlgorithm = 'HS256';
      const encryptedAlgorithm = 'RSA-OAEP';
      const encode = 'base64';
      const signed = new JarmOption.Signed(signedAlgorithm);
      const encrypted = new JarmOption.Encrypted(encryptedAlgorithm, encode);
      const signedAndEncrypted = new JarmOption.SignedAndEncrypted(
        signed,
        encrypted
      );

      const result = signedAndEncrypted.jweAlg();

      expect(result).toBe(encryptedAlgorithm);
    });

    it('should return the encode of encrypted for encryptionMethod', () => {
      const signedAlgorithm = 'HS256';
      const encryptedAlgorithm = 'RSA-OAEP';
      const encode = 'base64';
      const signed = new JarmOption.Signed(signedAlgorithm);
      const encrypted = new JarmOption.Encrypted(encryptedAlgorithm, encode);
      const signedAndEncrypted = new JarmOption.SignedAndEncrypted(
        signed,
        encrypted
      );

      const result = signedAndEncrypted.encryptionMethod();

      expect(result).toBe(encode);
    });
  });
});

describe('EmbedOption', () => {
  describe('ByValue', () => {
    it('should create an instance of ByValue', () => {
      const embedOption = new EmbedOption.ByValue();

      expect(embedOption).toBeInstanceOf(EmbedOption.ByValue);
    });
  });

  describe('ByReference', () => {
    it('should create an instance of ByReference', () => {
      const urlBuilder = vi.fn().mockReturnValue(new URL('http://example.com'));

      const embedOption = new EmbedOption.ByReference(urlBuilder);

      expect(embedOption).toBeInstanceOf(EmbedOption.ByReference);
    });

    it('should set the builderUrl property', () => {
      const urlBuilder = vi.fn().mockReturnValue(new URL('http://example.com'));

      const embedOption = new EmbedOption.ByReference(urlBuilder);

      expect(embedOption.buildUrl).toBe(urlBuilder);
    });
  });

  describe('byReference', () => {
    it('should create an instance of ByReference', () => {
      const urlBuilder = vi.fn().mockReturnValue(new URL('http://example.com'));

      const embedOption = EmbedOption.byReference(urlBuilder);

      expect(embedOption).toBeInstanceOf(EmbedOption.ByReference);
    });

    it('should set the builderUrl property', () => {
      const urlBuilder = vi.fn().mockReturnValue(new URL('http://example.com'));

      const embedOption = EmbedOption.byReference(urlBuilder);

      expect(embedOption.buildUrl).toBe(urlBuilder);
    });
  });
});
