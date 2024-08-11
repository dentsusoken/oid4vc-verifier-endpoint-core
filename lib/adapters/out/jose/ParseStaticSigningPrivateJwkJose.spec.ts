import { describe, it, expect } from 'vitest';
import { createParseStaticSigningPrivateJwkJoseInvoker } from './ParseStaticSigningPrivateJwkJose';
import { generateKeyPair, exportJWK } from 'jose';

describe('ParseStaticSigningPrivateJwkJose', () => {
  const parseStaticSigningPrivateJwk =
    createParseStaticSigningPrivateJwkJoseInvoker();

  it('should parse a valid JWK string and return a StaticSigningPrivateJwk', async () => {
    // Given
    const { privateKey } = await generateKeyPair('ES256');
    const jwkString = JSON.stringify(await exportJWK(privateKey));

    // When
    const result = await parseStaticSigningPrivateJwk(jwkString);

    // Then
    expect(result.isSuccess).toBe(true);
    expect(result.getOrThrow()).toEqual({
      value: jwkString,
    });
  });

  it('should return a failure result when the JWK string is invalid', async () => {
    // Given
    const invalidJwkString = 'invalid-jwk-string';

    // When
    const result = await createParseStaticSigningPrivateJwkJoseInvoker()(
      invalidJwkString
    );

    // Then
    expect(result.isFailure).toBe(true);
    expect(result.exceptionOrUndefined()).toBeInstanceOf(SyntaxError);
  });
});
