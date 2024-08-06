import { describe, it, expect } from 'vitest';
import { GetWalletResponseMethodNS } from './GetWalletResponseMethod';

describe('GetWalletResponseMethod', () => {
  describe('Poll', () => {
    it('should create an instance of Poll', () => {
      // When
      const poll = new GetWalletResponseMethodNS.Poll();

      // Then
      expect(poll).toBeDefined();
    });
  });

  describe('Redirect', () => {
    it('should create an instance of Redirect with the provided redirectUriTemplate', () => {
      // Given
      const redirectUriTemplate = 'https://example.com/redirect';

      // When
      const redirect = new GetWalletResponseMethodNS.Redirect(
        redirectUriTemplate
      );

      // Then
      expect(redirect.redirectUriTemplate).toBe(redirectUriTemplate);
    });
  });

  describe('isPoll', () => {
    it('should return true for an instance of Poll', () => {
      // Given
      const poll = new GetWalletResponseMethodNS.Poll();

      // When
      const result = GetWalletResponseMethodNS.isPoll(poll);

      // Then
      expect(result).toBe(true);
    });

    it('should return false for an instance of Redirect', () => {
      // Given
      const redirect = new GetWalletResponseMethodNS.Redirect(
        'https://example.com/redirect'
      );

      // When
      const result = GetWalletResponseMethodNS.isPoll(redirect);

      // Then
      expect(result).toBe(false);
    });
  });

  describe('isRedirect', () => {
    it('should return true for an instance of Redirect', () => {
      // Given
      const redirect = new GetWalletResponseMethodNS.Redirect(
        'https://example.com/redirect'
      );

      // When
      const result = GetWalletResponseMethodNS.isRedirect(redirect);

      // Then
      expect(result).toBe(true);
    });

    it('should return false for an instance of Poll', () => {
      // Given
      const poll = new GetWalletResponseMethodNS.Poll();

      // When
      const result = GetWalletResponseMethodNS.isRedirect(poll);

      // Then
      expect(result).toBe(false);
    });
  });
});
