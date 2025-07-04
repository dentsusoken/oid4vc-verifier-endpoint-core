import { describe, it, expect } from 'vitest';
import { GetWalletResponseMethod, ResponseCode } from '../../domain';
import {
  createResponseCode,
  createWalletResponseAcceptedTO,
} from './PostWalletResponseService.create';
import {
  createCreateQueryWalletResponseRedirectUriInvoker,
  createGenerateResponseCodeInvoker,
} from '../../adapters/out/cfg';
import { WalletResponseAcceptedTO } from '../../ports/input';

describe('PostWalletResponse.create', () => {
  describe('createResponseCode', () => {
    const generateResponseCode = createGenerateResponseCodeInvoker();

    it('should return ResponseCode when getWalletResponseMethod is Redirect', async () => {
      const getWalletResponseMethod = new GetWalletResponseMethod.Redirect(
        'aaa'
      );

      const result = await createResponseCode(
        getWalletResponseMethod,
        generateResponseCode
      );

      expect(result).toBeInstanceOf(ResponseCode);
      expect(result?.value).toBeDefined();
    });

    it('should return undefined when getWalletResponseMethod is not Redirect', async () => {
      const getWalletResponseMethod = GetWalletResponseMethod.Poll.INSTANCE;

      const result = await createResponseCode(
        getWalletResponseMethod,
        generateResponseCode
      );

      expect(result).toBeUndefined();
    });
  });

  describe('createWalletResponseAcceptedTO', () => {
    const createQueryWalletResponseRedirectUri =
      createCreateQueryWalletResponseRedirectUriInvoker();

    it('should return WalletResponseAcceptedTO with redirect URI when getWalletResponseMethod is Redirect and responseCode is provided', async () => {
      const getWalletResponseMethod = new GetWalletResponseMethod.Redirect(
        'https://example.com/response/{RESPONSE_CODE}'
      );
      const responseCode = new ResponseCode('test-response-code');

      const result = await createWalletResponseAcceptedTO(
        getWalletResponseMethod,
        createQueryWalletResponseRedirectUri,
        responseCode
      );

      expect(result).toBeInstanceOf(WalletResponseAcceptedTO);
      expect(result?.redirectUri).toBe(
        'https://example.com/response/test-response-code'
      );
    });

    it('should throw an error when getWalletResponseMethod is Redirect but responseCode is undefined', async () => {
      const getWalletResponseMethod = new GetWalletResponseMethod.Redirect(
        'https://example.com/response/{RESPONSE_CODE}'
      );

      await expect(
        createWalletResponseAcceptedTO(
          getWalletResponseMethod,
          createQueryWalletResponseRedirectUri,
          undefined
        )
      ).rejects.toThrowError('Not found response code');
    });

    it('should return undefined when getWalletResponseMethod is not Redirect', async () => {
      const getWalletResponseMethod = GetWalletResponseMethod.Poll.INSTANCE;
      const responseCode = new ResponseCode('test-response-code');

      const result = await createWalletResponseAcceptedTO(
        getWalletResponseMethod,
        createQueryWalletResponseRedirectUri,
        responseCode
      );

      expect(result).toBeUndefined();
    });
  });
});
