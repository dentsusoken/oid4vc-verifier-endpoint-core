import { describe, it, expect } from 'vitest';
import { WalletResponse, WalletResponseNS } from './WalletResponse';
import { PresentationSubmission } from 'oid4vc-prex';
import { Jwt } from '.';

describe('WalletResponseNS', () => {
  const mockJwt: Jwt = 'mock.jwt.token';
  const mockVpToken = 'mock_vp_token';
  const mockPresentationSubmission = {} as PresentationSubmission;

  describe('IdToken', () => {
    it('should create an instance with valid idToken', () => {
      const idToken = new WalletResponseNS.IdToken(mockJwt);
      expect(idToken.idToken).toBe(mockJwt);
    });

    it('should throw an error if idToken is not provided', () => {
      expect(() => new WalletResponseNS.IdToken(null as never)).toThrow(
        'idToken is required'
      );
    });
  });

  describe('VpToken', () => {
    it('should create an instance with valid vpToken and presentationSubmission', () => {
      const vpToken = new WalletResponseNS.VpToken(
        mockVpToken,
        mockPresentationSubmission
      );
      expect(vpToken.vpToken).toBe(mockVpToken);
      expect(vpToken.presentationSubmission).toBe(mockPresentationSubmission);
    });

    it('should throw an error if vpToken is not provided', () => {
      expect(
        () =>
          new WalletResponseNS.VpToken(
            null as never,
            mockPresentationSubmission
          )
      ).toThrow('vpToken is required');
    });
  });

  describe('IdAndVpToken', () => {
    it('should create an instance with valid idToken, vpToken, and presentationSubmission', () => {
      const idAndVpToken = new WalletResponseNS.IdAndVpToken(
        mockJwt,
        mockVpToken,
        mockPresentationSubmission
      );
      expect(idAndVpToken.idToken).toBe(mockJwt);
      expect(idAndVpToken.vpToken).toBe(mockVpToken);
      expect(idAndVpToken.presentationSubmission).toBe(
        mockPresentationSubmission
      );
    });

    it('should throw an error if idToken is not provided', () => {
      expect(
        () =>
          new WalletResponseNS.IdAndVpToken(
            null as never,
            mockVpToken,
            mockPresentationSubmission
          )
      ).toThrow('idToken is required');
    });

    it('should throw an error if vpToken is not provided', () => {
      expect(
        () =>
          new WalletResponseNS.IdAndVpToken(
            mockJwt,
            undefined as unknown as string,
            mockPresentationSubmission
          )
      ).toThrow('vpToken is required');
    });
  });

  describe('Error', () => {
    it('should create an instance with value and description', () => {
      const error = new WalletResponseNS.WalletResponseError(
        'error_code',
        'Error description'
      );
      expect(error.value).toBe('error_code');
      expect(error.description).toBe('Error description');
    });

    it('should create an instance with only value', () => {
      const error = new WalletResponseNS.WalletResponseError('error_code');
      expect(error.value).toBe('error_code');
      expect(error.description).toBeUndefined();
    });
  });

  describe('Type guards', () => {
    it('isIdToken should return true for IdToken instances', () => {
      const idToken = new WalletResponseNS.IdToken(mockJwt);
      expect(WalletResponseNS.isIdToken(idToken)).toBe(true);
      expect(WalletResponseNS.isIdToken({} as WalletResponse)).toBe(false);
    });

    it('isVpToken should return true for VpToken instances', () => {
      const vpToken = new WalletResponseNS.VpToken(
        mockVpToken,
        mockPresentationSubmission
      );
      expect(WalletResponseNS.isVpToken(vpToken)).toBe(true);
      expect(WalletResponseNS.isVpToken({} as WalletResponse)).toBe(false);
    });

    it('isIdAndVpToken should return true for IdAndVpToken instances', () => {
      const idAndVpToken = new WalletResponseNS.IdAndVpToken(
        mockJwt,
        mockVpToken,
        mockPresentationSubmission
      );
      expect(WalletResponseNS.isIdAndVpToken(idAndVpToken)).toBe(true);
      expect(WalletResponseNS.isIdAndVpToken({} as WalletResponse)).toBe(false);
    });

    it('isError should return true for Error instances', () => {
      const error = new WalletResponseNS.WalletResponseError('error_code');
      expect(WalletResponseNS.isWalletResponseError(error)).toBe(true);
      expect(WalletResponseNS.isWalletResponseError({} as WalletResponse)).toBe(
        false
      );
    });
  });
});
