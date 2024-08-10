import { describe, it, expect } from 'vitest';
import { PresentationSubmission } from 'oid4vc-prex';
import { Jwt, WalletResponse } from '.';

describe('WalletResponse', () => {
  describe('IdToken', () => {
    it('should have the correct __type', () => {
      const idToken = 'id-token';
      const walletResponse = new WalletResponse.IdToken(idToken);
      expect(walletResponse.__type).toBe('IdToken');
    });

    it('should store the idToken', () => {
      const idToken = 'id-token';
      const walletResponse = new WalletResponse.IdToken(idToken);
      expect(walletResponse.idToken).toBe(idToken);
    });

    it('should throw an error if idToken is not provided', () => {
      expect(() => new WalletResponse.IdToken('')).toThrowError(
        'idToken is required'
      );
    });
  });

  describe('VpToken', () => {
    it('should have the correct __type', () => {
      const vpToken = 'vp-token';
      const presentationSubmission = {} as PresentationSubmission;
      const walletResponse = new WalletResponse.VpToken(
        vpToken,
        presentationSubmission
      );
      expect(walletResponse.__type).toBe('VpToken');
    });

    it('should store the vpToken and presentationSubmission', () => {
      const vpToken = 'vp-token';
      const presentationSubmission = {} as PresentationSubmission;
      const walletResponse = new WalletResponse.VpToken(
        vpToken,
        presentationSubmission
      );
      expect(walletResponse.vpToken).toBe(vpToken);
      expect(walletResponse.presentationSubmission).toBe(
        presentationSubmission
      );
    });

    it('should throw an error if vpToken is not provided', () => {
      const presentationSubmission = {} as PresentationSubmission;
      expect(
        () => new WalletResponse.VpToken('', presentationSubmission)
      ).toThrowError('vpToken is required');
    });
  });

  describe('IdAndVpToken', () => {
    it('should have the correct __type', () => {
      const idToken = 'id-token';
      const vpToken = 'vp-token';
      const presentationSubmission = {} as PresentationSubmission;
      const walletResponse = new WalletResponse.IdAndVpToken(
        idToken,
        vpToken,
        presentationSubmission
      );
      expect(walletResponse.__type).toBe('IdAndVpToken');
    });

    it('should store the idToken, vpToken, and presentationSubmission', () => {
      const idToken = 'id-token';
      const vpToken = 'vp-token';
      const presentationSubmission = {} as PresentationSubmission;
      const walletResponse = new WalletResponse.IdAndVpToken(
        idToken,
        vpToken,
        presentationSubmission
      );
      expect(walletResponse.idToken).toBe(idToken);
      expect(walletResponse.vpToken).toBe(vpToken);
      expect(walletResponse.presentationSubmission).toBe(
        presentationSubmission
      );
    });

    it('should throw an error if idToken is not provided', () => {
      const vpToken = 'vp-token';
      const presentationSubmission = {} as PresentationSubmission;
      expect(
        () =>
          new WalletResponse.IdAndVpToken(
            undefined as unknown as Jwt,
            vpToken,
            presentationSubmission
          )
      ).toThrowError('idToken is required');
    });

    it('should throw an error if vpToken is not provided', () => {
      const idToken = 'id-token';
      const presentationSubmission = {} as PresentationSubmission;
      expect(
        () =>
          new WalletResponse.IdAndVpToken(
            idToken,
            undefined as unknown as Jwt,
            presentationSubmission
          )
      ).toThrowError('vpToken is required');
    });
  });

  describe('WalletResponseError', () => {
    it('should have the correct __type', () => {
      const value = 'error';
      const description = 'error description';
      const walletResponse = new WalletResponse.WalletResponseError(
        value,
        description
      );
      expect(walletResponse.__type).toBe('WalletResponseError');
    });

    it('should store the value and description', () => {
      const value = 'error';
      const description = 'error description';
      const walletResponse = new WalletResponse.WalletResponseError(
        value,
        description
      );
      expect(walletResponse.value).toBe(value);
      expect(walletResponse.description).toBe(description);
    });
  });

  describe('type guard', () => {
    it('should correctly identify IdToken using if statement', () => {
      const idToken = 'id-token';
      const walletResponse: WalletResponse = new WalletResponse.IdToken(
        idToken
      );

      if (walletResponse.__type === 'IdToken') {
        expect(walletResponse.idToken).toBe(idToken);
      } else {
        throw new Error('Expected walletResponse to be of type IdToken');
      }
    });

    it('should correctly identify VpToken using if statement', () => {
      const vpToken = 'vp-token';
      const presentationSubmission = {} as PresentationSubmission;
      const walletResponse: WalletResponse = new WalletResponse.VpToken(
        vpToken,
        presentationSubmission
      );

      if (walletResponse.__type === 'VpToken') {
        expect(walletResponse.vpToken).toBe(vpToken);
        expect(walletResponse.presentationSubmission).toBe(
          presentationSubmission
        );
      } else {
        throw new Error('Expected walletResponse to be of type VpToken');
      }
    });

    it('should correctly identify IdAndVpToken using if statement', () => {
      const idToken = 'id-token';
      const vpToken = 'vp-token';
      const presentationSubmission = {} as PresentationSubmission;
      const walletResponse: WalletResponse = new WalletResponse.IdAndVpToken(
        idToken,
        vpToken,
        presentationSubmission
      );

      if (walletResponse.__type === 'IdAndVpToken') {
        expect(walletResponse.idToken).toBe(idToken);
        expect(walletResponse.vpToken).toBe(vpToken);
        expect(walletResponse.presentationSubmission).toBe(
          presentationSubmission
        );
      } else {
        throw new Error('Expected walletResponse to be of type IdAndVpToken');
      }
    });

    it('should correctly identify WalletResponseError using if statement', () => {
      const value = 'error';
      const description = 'error description';
      const walletResponse: WalletResponse =
        new WalletResponse.WalletResponseError(value, description);

      if (walletResponse.__type === 'WalletResponseError') {
        expect(walletResponse.value).toBe(value);
        expect(walletResponse.description).toBe(description);
      } else {
        throw new Error(
          'Expected walletResponse to be of type WalletResponseError'
        );
      }
    });

    it('should correctly identify IdToken using switch statement', () => {
      const idToken = 'id-token';
      const walletResponse: WalletResponse = new WalletResponse.IdToken(
        idToken
      );

      switch (walletResponse.__type) {
        case 'IdToken':
          expect(walletResponse.idToken).toBe(idToken);
          break;
        default:
          throw new Error('Expected walletResponse to be of type IdToken');
      }
    });

    it('should correctly identify VpToken using switch statement', () => {
      const vpToken = 'vp-token';
      const presentationSubmission = {} as PresentationSubmission;
      const walletResponse: WalletResponse = new WalletResponse.VpToken(
        vpToken,
        presentationSubmission
      );

      switch (walletResponse.__type) {
        case 'VpToken':
          expect(walletResponse.vpToken).toBe(vpToken);
          expect(walletResponse.presentationSubmission).toBe(
            presentationSubmission
          );
          break;
        default:
          throw new Error('Expected walletResponse to be of type VpToken');
      }
    });

    it('should correctly identify IdAndVpToken using switch statement', () => {
      const idToken = 'id-token';
      const vpToken = 'vp-token';
      const presentationSubmission = {} as PresentationSubmission;
      const walletResponse: WalletResponse = new WalletResponse.IdAndVpToken(
        idToken,
        vpToken,
        presentationSubmission
      );

      switch (walletResponse.__type) {
        case 'IdAndVpToken':
          expect(walletResponse.idToken).toBe(idToken);
          expect(walletResponse.vpToken).toBe(vpToken);
          expect(walletResponse.presentationSubmission).toBe(
            presentationSubmission
          );
          break;
        default:
          throw new Error('Expected walletResponse to be of type IdAndVpToken');
      }
    });

    it('should correctly identify WalletResponseError using switch statement', () => {
      const value = 'error';
      const description = 'error description';
      const walletResponse: WalletResponse =
        new WalletResponse.WalletResponseError(value, description);

      switch (walletResponse.__type) {
        case 'WalletResponseError':
          expect(walletResponse.value).toBe(value);
          expect(walletResponse.description).toBe(description);
          break;
        default:
          throw new Error(
            'Expected walletResponse to be of type WalletResponseError'
          );
      }
    });
  });
});
