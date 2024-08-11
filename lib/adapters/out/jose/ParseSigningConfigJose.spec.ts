import { describe, it, expect } from 'vitest';
import { generateKeyPair, exportJWK } from 'jose';
import { createParseSigningConfigJoseInvoker } from './ParseSigningConfigJose';

describe('createParseSigningConfigJoseInvoker', () => {
  const parseSigningConfig = createParseSigningConfigJoseInvoker();

  it('should return a valid SigningConfig with correct ES256 JWK and algorithm', async () => {
    const { privateKey } = await generateKeyPair('ES256');
    const privateJwk = JSON.stringify(await exportJWK(privateKey));
    const algorithm = 'ES256';

    const result = await parseSigningConfig(privateJwk, algorithm);

    expect(result.isSuccess).toBe(true);
    const signingConfig = result.getOrThrow();
    expect(signingConfig.staticSigningPrivateJwk.value).toBe(privateJwk);
    expect(signingConfig.algorithm).toBe(algorithm);
  });

  it('should return a failure result with invalid JWK', async () => {
    const invalidJwk = '{"kty":"EC","crv":"P-256","x":"invalid","y":"invalid"}';
    const algorithm = 'ES256';

    const result = await parseSigningConfig(invalidJwk, algorithm);

    expect(result.isFailure).toBe(true);
    const error = result.exceptionOrUndefined();
    expect(error).toBeInstanceOf(Error);
    expect(error?.message).toContain('Invalid JWK');
  });

  it('should return a failure result with mismatched algorithm', async () => {
    const { privateKey } = await generateKeyPair('ES256');
    const privateJwk = JSON.stringify(await exportJWK(privateKey));
    const invalidAlgorithm = 'invalidAlg';

    const result = await parseSigningConfig(privateJwk, invalidAlgorithm);
    console.log(result);

    expect(result.isFailure).toBe(true);
    const error = result.exceptionOrUndefined();
    expect(error).toBeInstanceOf(Error);
    expect(error?.message).toContain(
      'algorithm from JWK: ES256, specified: invalidAlg'
    );
  });
});
