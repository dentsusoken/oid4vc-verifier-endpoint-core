import { describe, it, expect } from 'vitest';
import {
  CreateQueryWalletResponseRedirectUri,
  redirectUri,
  isValidTemplate,
} from './CreateQueryWalletResponseRedirectUri';
import { ResponseCode, GetWalletResponseMethod } from '../../../domain';

describe('CreateQueryWalletResponseRedirectUri', () => {
  const validTemplate = 'https://example.com/?response_code={RESPONSE_CODE}';
  const invalidTemplate = 'https://example.com/?response_code=';

  describe('Simple.redirectUri', () => {
    it('should return a success result with a valid URL for a valid template', () => {
      const result = CreateQueryWalletResponseRedirectUri.Simple.redirectUri(
        validTemplate,
        new ResponseCode('123')
      );
      expect(result.isSuccess).toBeTruthy;
      expect(result.getOrNull()?.toString()).toEqual(
        'https://example.com/?response_code=123'
      );
    });

    it('should return a failure result for an invalid template', () => {
      const result = CreateQueryWalletResponseRedirectUri.Simple.redirectUri(
        invalidTemplate,
        new ResponseCode('123')
      );
      expect(result.isFailure).toBeTruthy;
    });

    it('should throw an error for an invalid URL', () => {
      const invalidUrlTemplate = 'not a valid url {RESPONSE_CODE}';
      const result = CreateQueryWalletResponseRedirectUri.Simple.redirectUri(
        invalidUrlTemplate,
        new ResponseCode('123')
      );
      expect(result.isFailure).toBeTruthy;
    });
  });

  describe('redirectUri', () => {
    it('should return a valid URL for a valid redirect method', () => {
      const redirect = new GetWalletResponseMethod.Redirect(validTemplate);
      const url = redirectUri(redirect, new ResponseCode('456'));
      expect(url.toString()).toEqual('https://example.com/?response_code=456');
    });

    it('should throw an error for an invalid redirect method', () => {
      const redirect = new GetWalletResponseMethod.Redirect(invalidTemplate);

      expect(() => redirectUri(redirect, new ResponseCode('456'))).toThrow();
    });
  });

  describe('validTemplate', () => {
    it('should return true for a valid template', () => {
      expect(isValidTemplate(validTemplate)).toBeTruthy;
    });

    it('should return false for an invalid template', () => {
      expect(isValidTemplate(invalidTemplate)).toBeFalsy;
    });
  });
});
