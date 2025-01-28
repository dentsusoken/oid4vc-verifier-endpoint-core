import { describe, it, expect } from 'vitest';
import { WalletResponse } from '../../domain';
import { WalletResponseTO } from '../../ports/input';
import { toWalletResponseTO } from './GetWalletResponseService.convert';
import { PresentationSubmission } from 'oid4vc-prex';

describe('GetWalletResponseService.convert', () => {
  describe('toWalletResponseTO', () => {
    it('should convert IdToken wallet response correctly', () => {
      const idToken = 'sample-id-token';
      const walletResponse = new WalletResponse.IdToken(idToken);

      const result = toWalletResponseTO(walletResponse);

      expect(result).toBeInstanceOf(WalletResponseTO);
      expect(result.idToken).toBe(idToken);
    });

    it('should convert VpToken wallet response correctly', () => {
      const vpToken = 'sample-vp-token';
      const presentationSubmission = {} as PresentationSubmission;
      const walletResponse = new WalletResponse.VpToken(
        vpToken,
        presentationSubmission
      );

      const result = toWalletResponseTO(walletResponse);

      expect(result).toBeInstanceOf(WalletResponseTO);
      expect(result.vpToken).toBe(vpToken);
      expect(result.presentationSubmission).toBe(presentationSubmission);
    });

    it('should convert IdAndVpToken wallet response correctly', () => {
      const idToken = 'sample-id-token';
      const vpToken = 'sample-vp-token';
      const presentationSubmission = {} as PresentationSubmission;
      const walletResponse = new WalletResponse.IdAndVpToken(
        idToken,
        vpToken,
        presentationSubmission
      );

      const result = toWalletResponseTO(walletResponse);

      expect(result).toBeInstanceOf(WalletResponseTO);
      expect(result.idToken).toBe(idToken);
      expect(result.vpToken).toBe(vpToken);
      expect(result.presentationSubmission).toEqual(presentationSubmission);
    });

    it('should convert WalletResponseError correctly', () => {
      const error = 'sample-error';
      const errorDescription = 'Sample error description';
      const walletResponse = new WalletResponse.WalletResponseError(
        error,
        errorDescription
      );

      const result = toWalletResponseTO(walletResponse);

      expect(result).toBeInstanceOf(WalletResponseTO);
      expect(result.error).toBe(error);
      expect(result.errorDescription).toBe(errorDescription);
    });
  });
});
