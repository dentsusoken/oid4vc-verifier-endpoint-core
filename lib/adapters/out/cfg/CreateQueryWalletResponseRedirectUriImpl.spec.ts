import 'reflect-metadata';
import { describe, it, expect } from 'vitest';
import {
  createCreateQueryWalletResponseRedirectUriInvoker,
  RESPONSE_CODE_PLACE_HOLDER,
} from './CreateQueryWalletResponseRedirectUriImpl';
import { ResponseCode } from '../../../domain';

describe('createCreateQueryWalletResponseRedirectUri', () => {
  const createQueryWalletResponseRedirectUri =
    createCreateQueryWalletResponseRedirectUriInvoker();

  it('should successfully create a URL with the response code', () => {
    const template = `https://example.com/callback?code=${RESPONSE_CODE_PLACE_HOLDER}`;
    const responseCode = new ResponseCode('123456');

    const result = createQueryWalletResponseRedirectUri(template, responseCode);

    expect(result.isSuccess()).toBe(true);
    const url = result.getOrThrow();
    expect(url.href).toBe('https://example.com/callback?code=123456');
  });

  it('should throw an error if the template does not include the response code placeholder', () => {
    const template = 'https://example.com/callback';
    const responseCode = new ResponseCode('123456');

    const result = createQueryWalletResponseRedirectUri(template, responseCode);

    expect(result.isFailure()).toBe(true);
    expect(result.error?.message).toBe(
      'Expected response_code place holder not found in template'
    );
  });

  it('should handle invalid URLs', () => {
    const template = `invalid-url${RESPONSE_CODE_PLACE_HOLDER}`;
    const responseCode = new ResponseCode('123456');

    const result = createQueryWalletResponseRedirectUri(template, responseCode);

    expect(result.isFailure()).toBe(true);
    expect(result.error).toBeInstanceOf(TypeError);
  });
});
