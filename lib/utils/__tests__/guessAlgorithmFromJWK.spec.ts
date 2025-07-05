import { describe, it, expect } from 'vitest';
import { guessAlgorithmFromJWK } from '../guessAlgorithmFromJWK';

describe('guessAlgorithmFromJWK', () => {
  it('should return the algorithm when alg property is present', () => {
    const jwk = { alg: 'RS256', kty: 'RSA' };
    expect(guessAlgorithmFromJWK(jwk)).toBe('RS256');
  });

  it('should return ES256 for EC key with P-256 curve', () => {
    const jwk = { kty: 'EC', crv: 'P-256' };
    expect(guessAlgorithmFromJWK(jwk)).toBe('ES256');
  });

  it('should return ES384 for EC key with P-384 curve', () => {
    const jwk = { kty: 'EC', crv: 'P-384' };
    expect(guessAlgorithmFromJWK(jwk)).toBe('ES384');
  });

  it('should return ES512 for EC key with P-521 curve', () => {
    const jwk = { kty: 'EC', crv: 'P-521' };
    expect(guessAlgorithmFromJWK(jwk)).toBe('ES512');
  });

  it('should return null for EC key with unknown curve', () => {
    const jwk = { kty: 'EC', crv: 'unknown' };
    expect(guessAlgorithmFromJWK(jwk)).toBeNull();
  });

  it('should return EdDSA for OKP key with Ed25519 curve', () => {
    const jwk = { kty: 'OKP', crv: 'Ed25519' };
    expect(guessAlgorithmFromJWK(jwk)).toBe('EdDSA');
  });

  it('should return null for OKP key with unknown curve', () => {
    const jwk = { kty: 'OKP', crv: 'unknown' };
    expect(guessAlgorithmFromJWK(jwk)).toBeNull();
  });

  it('should return null for unknown key type', () => {
    const jwk = { kty: 'UNKNOWN' };
    expect(guessAlgorithmFromJWK(jwk)).toBeNull();
  });

  it('should prioritize alg property over key type and curve', () => {
    const jwk = { alg: 'RS256', kty: 'EC', crv: 'P-256' };
    expect(guessAlgorithmFromJWK(jwk)).toBe('RS256');
  });
});
