import 'reflect-metadata';
import { describe, it, expect } from 'vitest';
import { sign } from './SignRequestObjectJose.sign';
import { SigningConfig } from '../../../domain';
import { PresentationDefinition } from 'oid4vc-prex';
import { RequestObject } from './RequestObject';
import { ClientMetaDataTO } from './SignRequestObjectJose.convert';
import { generateKeyPair, exportJWK, decodeProtectedHeader } from 'jose';

describe('sign', () => {
  it('should sign the request object with pre-registered successfully', async () => {
    // Prepare test data
    const staticSigningPrivateKey = (await generateKeyPair('ES256')).privateKey;
    const staticSigningPrivateExportedJwk = await exportJWK(
      staticSigningPrivateKey
    );
    staticSigningPrivateExportedJwk.kid = 'kid';
    staticSigningPrivateExportedJwk.x5c = ['x5c'];
    const signingConfig: SigningConfig = {
      staticSigningPrivateJwk: {
        value: JSON.stringify(staticSigningPrivateExportedJwk),
      },
      algorithm: 'ES256',
    };
    const requestObject: RequestObject = {
      clientId: 'client123',
      aud: ['audience1'],
      responseType: ['vp_token'],
      scope: ['openid'],
      state: 'state123',
      nonce: 'nonce123',
      clientIdSchemeName: 'pre-registered',
      responseMode: 'direct_post',
      issuedAt: new Date('2023-06-08T10:00:00Z'),
      idTokenType: ['subject_signed'],
      presentationDefinition: {} as PresentationDefinition,
      presentationDefinitionUri: new URL('https://example.com/pd'),
      responseUri: new URL('https://example.com/response'),
    };
    const clientMetaDataTO: ClientMetaDataTO = {
      id_token_signed_response_alg: 'RS256',
      id_token_encrypted_response_alg: 'RSA-OAEP',
      id_token_encrypted_response_enc: 'A256GCM',
      subject_syntax_types_supported: ['urn:ietf:params:oauth:jwk-thumbprint'],
    };

    // Call the sign function
    const result = await sign(signingConfig, requestObject, clientMetaDataTO);

    // Verify the result
    expect(result.isSuccess()).toBe(true);
    const jwt = result.getOrThrow();
    expect(jwt).toMatch(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/);
    const header = decodeProtectedHeader(jwt);
    expect(header.kid).toBe('kid');
    expect(header.x5c).toBeUndefined();
  });

  it('should sign the request object with x509_san_dns successfully', async () => {
    // Prepare test data
    const staticSigningPrivateKey = (await generateKeyPair('ES256')).privateKey;
    const staticSigningPrivateExportedJwk = await exportJWK(
      staticSigningPrivateKey
    );
    staticSigningPrivateExportedJwk.kid = 'kid';
    staticSigningPrivateExportedJwk.x5c = ['x5c'];
    const signingConfig: SigningConfig = {
      staticSigningPrivateJwk: {
        value: JSON.stringify(staticSigningPrivateExportedJwk),
      },
      algorithm: 'ES256',
    };
    const requestObject: RequestObject = {
      clientId: 'client123',
      aud: ['audience1'],
      responseType: ['vp_token'],
      scope: ['openid'],
      state: 'state123',
      nonce: 'nonce123',
      clientIdSchemeName: 'x509_san_dns',
      responseMode: 'direct_post',
      issuedAt: new Date('2023-06-08T10:00:00Z'),
      idTokenType: ['subject_signed'],
      presentationDefinition: {} as PresentationDefinition,
      presentationDefinitionUri: new URL('https://example.com/pd'),
      responseUri: new URL('https://example.com/response'),
    };
    const clientMetaDataTO: ClientMetaDataTO = {
      id_token_signed_response_alg: 'RS256',
      id_token_encrypted_response_alg: 'RSA-OAEP',
      id_token_encrypted_response_enc: 'A256GCM',
      subject_syntax_types_supported: ['urn:ietf:params:oauth:jwk-thumbprint'],
    };

    // Call the sign function
    const result = await sign(signingConfig, requestObject, clientMetaDataTO);

    // Verify the result
    expect(result.isSuccess()).toBe(true);
    const jwt = result.getOrThrow();
    expect(jwt).toMatch(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/);
    const header = decodeProtectedHeader(jwt);
    expect(header.kid).toBeUndefined();
    expect(header.x5c).toEqual(['x5c']);
  });

  it('should sign the request object with x509_san_uri successfully', async () => {
    // Prepare test data
    const staticSigningPrivateKey = (await generateKeyPair('ES256')).privateKey;
    const staticSigningPrivateExportedJwk = await exportJWK(
      staticSigningPrivateKey
    );
    staticSigningPrivateExportedJwk.kid = 'kid';
    staticSigningPrivateExportedJwk.x5c = ['x5c'];
    const signingConfig: SigningConfig = {
      staticSigningPrivateJwk: {
        value: JSON.stringify(staticSigningPrivateExportedJwk),
      },
      algorithm: 'ES256',
    };
    const requestObject: RequestObject = {
      clientId: 'client123',
      aud: ['audience1'],
      responseType: ['vp_token'],
      scope: ['openid'],
      state: 'state123',
      nonce: 'nonce123',
      clientIdSchemeName: 'x509_san_uri',
      responseMode: 'direct_post',
      issuedAt: new Date('2023-06-08T10:00:00Z'),
      idTokenType: ['subject_signed'],
      presentationDefinition: {} as PresentationDefinition,
      presentationDefinitionUri: new URL('https://example.com/pd'),
      responseUri: new URL('https://example.com/response'),
    };
    const clientMetaDataTO: ClientMetaDataTO = {
      id_token_signed_response_alg: 'RS256',
      id_token_encrypted_response_alg: 'RSA-OAEP',
      id_token_encrypted_response_enc: 'A256GCM',
      subject_syntax_types_supported: ['urn:ietf:params:oauth:jwk-thumbprint'],
    };

    // Call the sign function
    const result = await sign(signingConfig, requestObject, clientMetaDataTO);

    // Verify the result
    expect(result.isSuccess()).toBe(true);
    const jwt = result.getOrThrow();
    expect(jwt).toMatch(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/);
    const header = decodeProtectedHeader(jwt);
    expect(header.kid).toBeUndefined();
    expect(header.x5c).toEqual(['x5c']);
  });
});
