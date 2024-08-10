import { describe, it, expect } from 'vitest';
import { GetWalletResponseMethod } from './GetWalletResponseMethod';

describe('GetWalletResponseMethod', () => {
  describe('Poll', () => {
    it('should have the correct __type', () => {
      expect(GetWalletResponseMethod.Poll.INSTANCE.__type).toBe('Poll');
    });

    it('should be a singleton', () => {
      expect(GetWalletResponseMethod.Poll.INSTANCE).toBe(
        GetWalletResponseMethod.Poll.INSTANCE
      );
    });
  });

  describe('Redirect', () => {
    it('should have the correct __type', () => {
      const redirectUriTemplate = 'https://example.com/redirect';
      const redirect = new GetWalletResponseMethod.Redirect(
        redirectUriTemplate
      );
      expect(redirect.__type).toBe('Redirect');
    });

    it('should store the redirectUriTemplate', () => {
      const redirectUriTemplate = 'https://example.com/redirect';
      const redirect = new GetWalletResponseMethod.Redirect(
        redirectUriTemplate
      );
      expect(redirect.redirectUriTemplate).toBe(redirectUriTemplate);
    });
  });

  describe('type guard', () => {
    it('should correctly identify Redirect using if statement', () => {
      const redirectUriTemplate = 'https://example.com/redirect';
      const responseMethod: GetWalletResponseMethod =
        new GetWalletResponseMethod.Redirect(redirectUriTemplate);

      if (responseMethod.__type === 'Redirect') {
        expect(responseMethod.redirectUriTemplate).toBe(redirectUriTemplate);
      } else {
        throw new Error('Expected responseMethod to be of type Redirect');
      }
    });

    it('should correctly identify Redirect using switch statement', () => {
      const redirectUriTemplate = 'https://example.com/redirect';
      const responseMethod: GetWalletResponseMethod =
        new GetWalletResponseMethod.Redirect(redirectUriTemplate);

      switch (responseMethod.__type) {
        case 'Redirect':
          expect(responseMethod.redirectUriTemplate).toBe(redirectUriTemplate);
          break;
        default:
          throw new Error('Expected responseMethod to be of type Redirect');
      }
    });
  });
});
