import 'reflect-metadata';
import { describe, it, expect } from 'vitest';
import { PresentationSubmission } from 'oid4vc-prex';
import { WalletResponse, WalletResponseJSON } from '.';

describe('WalletResponse', () => {
  describe('IdToken', () => {
    it('should create an instance of IdToken', () => {
      const idToken = 'id-token';
      const walletResponse = new WalletResponse.IdToken(idToken);

      expect(walletResponse).toBeInstanceOf(WalletResponse.IdToken);
      expect(walletResponse.idToken).toBe(idToken);
      expect(walletResponse.toJSON()).toEqual({
        __type: 'IdToken',
        id_token: idToken,
      });
    });

    it('should throw an error if idToken is not provided', () => {
      expect(() => new WalletResponse.IdToken('')).toThrowError(
        'idToken is required'
      );
    });
  });

  describe('VpToken', () => {
    it('should create an instance of VpToken', () => {
      const vpToken = 'vp-token';
      const presentationSubmission = {} as PresentationSubmission;
      const walletResponse = new WalletResponse.VpToken(
        vpToken,
        presentationSubmission
      );

      expect(walletResponse).toBeInstanceOf(WalletResponse.VpToken);
      expect(walletResponse.vpToken).toBe(vpToken);
      expect(walletResponse.presentationSubmission).toBe(
        presentationSubmission
      );
      expect(walletResponse.toJSON()).toEqual({
        __type: 'VpToken',
        vp_token: vpToken,
        presentation_submission: {},
      });
    });

    it('should throw an error if vpToken is not provided', () => {
      const presentationSubmission = {} as PresentationSubmission;
      expect(
        () => new WalletResponse.VpToken('', presentationSubmission)
      ).toThrowError('vpToken is required');
    });
  });

  describe('IdAndVpToken', () => {
    it('should create an instance of IdAndVpToken', () => {
      const idToken = 'id-token';
      const vpToken = 'vp-token';
      const presentationSubmission = {} as PresentationSubmission;
      const walletResponse = new WalletResponse.IdAndVpToken(
        idToken,
        vpToken,
        presentationSubmission
      );

      expect(walletResponse).toBeInstanceOf(WalletResponse.IdAndVpToken);
      expect(walletResponse.idToken).toBe(idToken);
      expect(walletResponse.vpToken).toBe(vpToken);
      expect(walletResponse.presentationSubmission).toBe(
        presentationSubmission
      );
      expect(walletResponse.toJSON()).toEqual({
        __type: 'IdAndVpToken',
        id_token: idToken,
        vp_token: vpToken,
        presentation_submission: presentationSubmission.toJSON(),
      });
    });

    it('should throw an error if idToken is not provided', () => {
      const vpToken = 'vp-token';
      const presentationSubmission = {} as PresentationSubmission;
      expect(
        () =>
          new WalletResponse.IdAndVpToken('', vpToken, presentationSubmission)
      ).toThrowError('idToken is required');
    });

    it('should throw an error if vpToken is not provided', () => {
      const idToken = 'id-token';
      const presentationSubmission = {} as PresentationSubmission;
      expect(
        () =>
          new WalletResponse.IdAndVpToken(idToken, '', presentationSubmission)
      ).toThrowError('vpToken is required');
    });
  });

  describe('WalletResponseError', () => {
    it('should create an instance of WalletResponseError', () => {
      const value = 'error-value';
      const description = 'error-description';
      const walletResponse = new WalletResponse.WalletResponseError(
        value,
        description
      );

      expect(walletResponse).toBeInstanceOf(WalletResponse.WalletResponseError);
      expect(walletResponse.value).toBe(value);
      expect(walletResponse.description).toBe(description);
      expect(walletResponse.toJSON()).toEqual({
        __type: 'WalletResponseError',
        value,
        description,
      });
    });
  });

  describe('fromJson', () => {
    it('should create an instance of IdToken from JSON', () => {
      const json: WalletResponseJSON = {
        __type: 'IdToken',
        id_token: 'id-token',
      };
      const walletResponse = WalletResponse.fromJson(json);

      expect(walletResponse).toBeInstanceOf(WalletResponse.IdToken);
      expect(
        walletResponse.__type === 'IdToken' && walletResponse.idToken
      ).toBe(json.id_token);
    });

    it('should create an instance of VpToken from JSON', () => {
      const vpToken = 'vp-token';
      const presentationSubmission = {} as PresentationSubmission;
      const json = new WalletResponse.VpToken(
        vpToken,
        presentationSubmission
      ).toJSON();
      // const json: WalletResponseJSON = {
      //   __type: 'VpToken',
      //   vp_token: 'vp-token',
      //   presentation_submission: { id: 'id' } as PresentationSubmission,
      // };
      const walletResponse = WalletResponse.fromJson(json);

      expect(walletResponse).toBeInstanceOf(WalletResponse.VpToken);
      expect(
        walletResponse.__type === 'VpToken' && walletResponse.vpToken
      ).toBe(json.vp_token);
      expect(
        walletResponse.__type === 'VpToken' &&
          walletResponse.presentationSubmission
      ).toBeInstanceOf(PresentationSubmission);
    });

    it('should create an instance of IdAndVpToken from JSON', () => {
      const idToken = 'id-token';
      const vpToken = 'vp-token';
      const presentationSubmission = {} as PresentationSubmission;
      const json = new WalletResponse.IdAndVpToken(
        idToken,
        vpToken,
        presentationSubmission
      ).toJSON();
      // const json: WalletResponseJSON = {
      //   __type: 'IdAndVpToken',
      //   id_token: 'id-token',
      //   vp_token: 'vp-token',
      //   presentation_submission: {} as PresentationSubmission,
      // };
      const walletResponse = WalletResponse.fromJson(json);

      expect(walletResponse).toBeInstanceOf(WalletResponse.IdAndVpToken);
      expect(
        walletResponse.__type === 'IdAndVpToken' && walletResponse.idToken
      ).toBe(json.id_token);
      expect(
        walletResponse.__type === 'IdAndVpToken' && walletResponse.vpToken
      ).toBe(json.vp_token);
      expect(
        walletResponse.__type === 'IdAndVpToken' &&
          walletResponse.presentationSubmission
      ).toBeInstanceOf(PresentationSubmission);
    });

    it('should create an instance of WalletResponseError from JSON', () => {
      const json: WalletResponseJSON = {
        __type: 'WalletResponseError',
        value: 'error-value',
        description: 'error-description',
      };
      const walletResponse = WalletResponse.fromJson(json);

      expect(walletResponse).toBeInstanceOf(WalletResponse.WalletResponseError);
      expect(
        walletResponse.__type === 'WalletResponseError' && walletResponse.value
      ).toBe(json.value);
      expect(
        walletResponse.__type === 'WalletResponseError' &&
          walletResponse.description
      ).toBe(json.description);
    });
  });

  describe('Type Guards', () => {
    it('should correctly identify IdToken', () => {
      const walletResponse = new WalletResponse.IdToken('id-token');

      if (walletResponse.__type === 'IdToken') {
        expect(walletResponse.idToken).toBe('id-token');
      } else {
        expect.fail('Expected walletResponse to be of type IdToken');
      }

      switch (walletResponse.__type) {
        case 'IdToken':
          expect(walletResponse.idToken).toBe('id-token');
          break;
        default:
          expect.fail('Expected walletResponse to be of type IdToken');
      }
    });

    it('should correctly identify VpToken', () => {
      const walletResponse = new WalletResponse.VpToken(
        'vp-token',
        {} as PresentationSubmission
      );

      if (walletResponse.__type === 'VpToken') {
        expect(walletResponse.vpToken).toBe('vp-token');
      } else {
        expect.fail('Expected walletResponse to be of type VpToken');
      }

      switch (walletResponse.__type) {
        case 'VpToken':
          expect(walletResponse.vpToken).toBe('vp-token');
          break;
        default:
          expect.fail('Expected walletResponse to be of type VpToken');
      }
    });

    it('should correctly identify IdAndVpToken', () => {
      const walletResponse = new WalletResponse.IdAndVpToken(
        'id-token',
        'vp-token',
        {} as PresentationSubmission
      );

      if (walletResponse.__type === 'IdAndVpToken') {
        expect(walletResponse.idToken).toBe('id-token');
        expect(walletResponse.vpToken).toBe('vp-token');
      } else {
        expect.fail('Expected walletResponse to be of type IdAndVpToken');
      }

      switch (walletResponse.__type) {
        case 'IdAndVpToken':
          expect(walletResponse.idToken).toBe('id-token');
          expect(walletResponse.vpToken).toBe('vp-token');
          break;
        default:
          expect.fail('Expected walletResponse to be of type IdAndVpToken');
      }
    });

    it('should correctly identify WalletResponseError', () => {
      const walletResponse = new WalletResponse.WalletResponseError(
        'error-value',
        'error-description'
      );

      if (walletResponse.__type === 'WalletResponseError') {
        expect(walletResponse.value).toBe('error-value');
        expect(walletResponse.description).toBe('error-description');
      } else {
        expect.fail(
          'Expected walletResponse to be of type WalletResponseError'
        );
      }

      switch (walletResponse.__type) {
        case 'WalletResponseError':
          expect(walletResponse.value).toBe('error-value');
          expect(walletResponse.description).toBe('error-description');
          break;
        default:
          expect.fail(
            'Expected walletResponse to be of type WalletResponseError'
          );
      }
    });
  });
});
