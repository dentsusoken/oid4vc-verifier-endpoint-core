import { describe, it, expect } from 'vitest';
import { ClientIdScheme, SigningConfig } from '.';

describe('ClientIdScheme', () => {
  describe('PreRegistered', () => {
    it('should create a PreRegistered instance', () => {
      const signingConfig = {} as SigningConfig;
      const preRegistered: ClientIdScheme = new ClientIdScheme.PreRegistered(
        'client1',
        signingConfig
      );

      expect(preRegistered).toBeInstanceOf(ClientIdScheme.PreRegistered);
      expect(preRegistered.__type).toBe('PreRegistered');
      expect(preRegistered.clientId).toBe('client1');
      expect(preRegistered.jarSigning).toBe(signingConfig);
    });
  });

  describe('X509SanDns', () => {
    it('should create an X509SanDns instance', () => {
      const signingConfig = {} as SigningConfig;
      const x509SanDns: ClientIdScheme = new ClientIdScheme.X509SanDns(
        'client2',
        signingConfig
      );

      expect(x509SanDns).toBeInstanceOf(ClientIdScheme.X509SanDns);
      expect(x509SanDns.__type).toBe('X509SanDns');
      expect(x509SanDns.clientId).toBe('client2');
      expect(x509SanDns.jarSigning).toBe(signingConfig);
    });
  });

  describe('X509SanUri', () => {
    it('should create an X509SanUri instance', () => {
      const signingConfig = {} as SigningConfig;
      const x509SanUri: ClientIdScheme = new ClientIdScheme.X509SanUri(
        'client3',
        signingConfig
      );

      expect(x509SanUri).toBeInstanceOf(ClientIdScheme.X509SanUri);
      expect(x509SanUri.__type).toBe('X509SanUri');
      expect(x509SanUri.clientId).toBe('client3');
      expect(x509SanUri.jarSigning).toBe(signingConfig);
    });
  });
});
