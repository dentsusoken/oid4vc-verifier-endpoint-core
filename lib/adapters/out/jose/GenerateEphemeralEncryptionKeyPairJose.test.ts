import { describe, it, expect } from 'vitest';
import { createGenerateEphemeralEncryptionKeyPairInvoker } from './GenerateEphemeralEncryptionKeyPairJose';
import { EphemeralEncryptionKeyPairJWK, JarmOption } from '../../../domain';
import { JWK } from 'jose';

describe('GenerateEphemeralEncryptionKeyPairJose', () => {
  it('should generate a valid EphemeralEncryptionKeyPairJWK', async () => {
    const generateEphemeralEncryptionKeyPair =
      createGenerateEphemeralEncryptionKeyPairInvoker();
    const mockEncryptedResponse = {} as JarmOption.Encrypted;

    const result = await generateEphemeralEncryptionKeyPair(
      mockEncryptedResponse
    );

    expect(result.isSuccess).toBeTruthy;
    const ephemeralKeyPair = result.getOrNull();
    //console.log(ephemeralKeyPair);
    expect(ephemeralKeyPair).toBeInstanceOf(EphemeralEncryptionKeyPairJWK);

    const parsedJWK = JSON.parse(ephemeralKeyPair!.value) as JWK;
    expect(parsedJWK.kty).toBe('EC');
    expect(parsedJWK.crv).toBe('P-256');
    expect(parsedJWK.x).toBeDefined();
    expect(parsedJWK.y).toBeDefined();
    expect(parsedJWK.d).toBeDefined();
    expect(parsedJWK.kid).toBeDefined();
    expect(typeof parsedJWK.kid).toBe('string');
    expect(parsedJWK.kid!.length).toBe(36); // UUID length
  });

  it('should generate unique keys for multiple calls', async () => {
    const generateEphemeralEncryptionKeyPair =
      createGenerateEphemeralEncryptionKeyPairInvoker();
    const mockEncryptedResponse = {} as JarmOption.Encrypted;

    const result1 = await generateEphemeralEncryptionKeyPair(
      mockEncryptedResponse
    );
    const result2 = await generateEphemeralEncryptionKeyPair(
      mockEncryptedResponse
    );

    expect(result1.isSuccess && result2.isSuccess).toBeTruthy;

    const jwk1 = JSON.parse(result1.getOrNull()!.value) as JWK;
    const jwk2 = JSON.parse(result2.getOrNull()!.value) as JWK;

    expect(jwk1.kid).not.toBe(jwk2.kid);
    expect(jwk1.x).not.toBe(jwk2.x);
    expect(jwk1.y).not.toBe(jwk2.y);
    expect(jwk1.d).not.toBe(jwk2.d);
  });
});
