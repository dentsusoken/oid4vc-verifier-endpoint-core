import { describe, it, expect } from 'vitest';
import { ClientIdSchemeNS } from './ClientIdScheme';
import { SigningConfig } from './SigningConfig';
import { StaticSigningPrivateJwk } from './StaticSigningPrivateJwk';

describe('ClientIdSchemeNS', () => {
  const mockSigningConfig: SigningConfig = {
    staticSigningPrivateJwk: {} as StaticSigningPrivateJwk,
    algorithm: 'mockAlgorithm',
  };

  describe('PreRegistered', () => {
    it('should create a PreRegistered instance correctly', () => {
      const preRegistered = new ClientIdSchemeNS.PreRegistered(
        'clientId1',
        mockSigningConfig
      );
      expect(preRegistered.clientId).toBe('clientId1');
      expect(preRegistered.jarSigning).toBe(mockSigningConfig);
    });
  });

  describe('X509SanDns', () => {
    it('should create a X509SanDns instance correctly', () => {
      const x509SanDns = new ClientIdSchemeNS.X509SanDns(
        'clientId2',
        mockSigningConfig
      );
      expect(x509SanDns.clientId).toBe('clientId2');
      expect(x509SanDns.jarSigning).toBe(mockSigningConfig);
    });
  });

  describe('X509SanUri', () => {
    it('should create a X509SanUri instance correctly', () => {
      const x509SanUri = new ClientIdSchemeNS.X509SanUri(
        'clientId3',
        mockSigningConfig
      );
      expect(x509SanUri.clientId).toBe('clientId3');
      expect(x509SanUri.jarSigning).toBe(mockSigningConfig);
    });
  });

  describe('isPreRegistered', () => {
    it('should return true for PreRegistered instance', () => {
      const preRegistered = new ClientIdSchemeNS.PreRegistered(
        'clientId1',
        mockSigningConfig
      );
      expect(ClientIdSchemeNS.isPreRegistered(preRegistered)).toBe(true);
    });

    it('should return false for non-PreRegistered instances', () => {
      const x509SanDns = new ClientIdSchemeNS.X509SanDns(
        'clientId2',
        mockSigningConfig
      );
      const x509SanUri = new ClientIdSchemeNS.X509SanUri(
        'clientId3',
        mockSigningConfig
      );
      expect(ClientIdSchemeNS.isPreRegistered(x509SanDns)).toBe(false);
      expect(ClientIdSchemeNS.isPreRegistered(x509SanUri)).toBe(false);
    });
  });

  describe('isX509SanDns', () => {
    it('should return true for X509SanDns instance', () => {
      const x509SanDns = new ClientIdSchemeNS.X509SanDns(
        'clientId2',
        mockSigningConfig
      );
      expect(ClientIdSchemeNS.isX509SanDns(x509SanDns)).toBe(true);
    });

    it('should return false for non-X509SanDns instances', () => {
      const preRegistered = new ClientIdSchemeNS.PreRegistered(
        'clientId1',
        mockSigningConfig
      );
      const x509SanUri = new ClientIdSchemeNS.X509SanUri(
        'clientId3',
        mockSigningConfig
      );
      expect(ClientIdSchemeNS.isX509SanDns(preRegistered)).toBe(false);
      expect(ClientIdSchemeNS.isX509SanDns(x509SanUri)).toBe(false);
    });
  });

  describe('isX509SanUri', () => {
    it('should return true for X509SanUri instance', () => {
      const x509SanUri = new ClientIdSchemeNS.X509SanUri(
        'clientId3',
        mockSigningConfig
      );
      expect(ClientIdSchemeNS.isX509SanUri(x509SanUri)).toBe(true);
    });

    it('should return false for non-X509SanUri instances', () => {
      const preRegistered = new ClientIdSchemeNS.PreRegistered(
        'clientId1',
        mockSigningConfig
      );
      const x509SanDns = new ClientIdSchemeNS.X509SanDns(
        'clientId2',
        mockSigningConfig
      );
      expect(ClientIdSchemeNS.isX509SanUri(preRegistered)).toBe(false);
      expect(ClientIdSchemeNS.isX509SanUri(x509SanDns)).toBe(false);
    });
  });
});
