import { describe, it, expect } from 'vitest';
import { createGenerateEphemeralECDHPrivateJwkJoseInvoker } from '../GenerateEphemeralECDHPrivateJwkJose';
import { JWK } from 'jose';

describe('GenerateEphemeralEncryptionKeyPairJose', () => {
  it('should generate a valid EphemeralEncryptionKeyPairJWK', async () => {
    const generateEphemeralECDHPrivateJwk =
      createGenerateEphemeralECDHPrivateJwkJoseInvoker();

    const result = await generateEphemeralECDHPrivateJwk();

    expect(result.isSuccess()).toBeTruthy;
    const privateJwk = result.getOrThrow();

    const parsedJWK = JSON.parse(privateJwk.value) as JWK;
    expect(parsedJWK.kty).toBe('EC');
    expect(parsedJWK.crv).toBe('P-256');
    expect(parsedJWK.use).toBe('enc');
    expect(parsedJWK.x).toBeDefined();
    expect(parsedJWK.y).toBeDefined();
    expect(parsedJWK.d).toBeDefined();
    expect(parsedJWK.kid).toBeDefined();
    expect(typeof parsedJWK.kid).toBe('string');
    expect(parsedJWK.kid!.length).toBe(36); // UUID length
  });

  it('should generate unique keys for multiple calls', async () => {
    const generateEphemeralECDHPrivateJwk =
      createGenerateEphemeralECDHPrivateJwkJoseInvoker();

    const result1 = await generateEphemeralECDHPrivateJwk();
    const result2 = await generateEphemeralECDHPrivateJwk();

    expect(result1.isSuccess() && result2.isSuccess()).toBeTruthy;

    const jwk1 = JSON.parse(result1.getOrThrow().value) as JWK;
    const jwk2 = JSON.parse(result2.getOrThrow().value) as JWK;

    expect(jwk1.kid).not.toBe(jwk2.kid);
    expect(jwk1.x).not.toBe(jwk2.x);
    expect(jwk1.y).not.toBe(jwk2.y);
    expect(jwk1.d).not.toBe(jwk2.d);
  });
});
