import 'reflect-metadata';
import { describe, it, expect } from 'vitest';
import {
  getJwks,
  getJwksUri,
  toClientMetaDataTO,
  toPayload,
  ClientMetaDataTO,
} from './SignRequestObjectJose.convert';
import {
  EmbedOption,
  RequestId,
  ClientMetaData,
  EphemeralECDHPrivateJwk,
  JarmOption,
  UrlBuilder,
} from '../../../domain';
import { RequestObject } from './RequestObject';
import { PresentationDefinition } from 'oid4vc-prex';

describe('JWKS and Payload Utilities', () => {
  describe('getJwks', () => {
    it('should return JWKS when jwkOption is ByValue and privateJwk is provided', () => {
      const jwkOption = EmbedOption.ByValue.INSTANCE;
      const privateJwk = new EphemeralECDHPrivateJwk(
        '{"kty":"EC","crv":"P-256","x":"abc","y":"def","d":"secret","use":"sig"}'
      );
      const result = getJwks(jwkOption, privateJwk);
      expect(result).toEqual({
        keys: [{ kty: 'EC', crv: 'P-256', x: 'abc', y: 'def', use: 'sig' }],
      });
    });

    it('should return undefined when jwkOption is not ByValue', () => {
      const jwkOption = new EmbedOption.ByReference(
        new UrlBuilder.WithRequestId('https://example.com/')
      );
      const privateJwk = new EphemeralECDHPrivateJwk('{}');
      const result = getJwks(jwkOption, privateJwk);
      expect(result).toBeUndefined();
    });
  });

  describe('getJwksUri', () => {
    it('should return JWKS URI when jwkOption is ByReference', () => {
      const jwkOption = new EmbedOption.ByReference(
        new UrlBuilder.WithRequestId('https://example.com/jwks/')
      );
      const requestId = new RequestId('test-id');
      const result = getJwksUri(jwkOption, requestId);
      expect(result).toBe('https://example.com/jwks/test-id');
    });

    it('should return undefined when jwkOption is not ByReference', () => {
      const jwkOption = EmbedOption.ByValue.INSTANCE;
      const requestId = new RequestId('test-id');
      const result = getJwksUri(jwkOption, requestId);
      expect(result).toBeUndefined();
    });
  });

  describe('toClientMetaDataTO', () => {
    it('should convert client metadata to transfer object', () => {
      const requestId = new RequestId('test-id');
      const clientMetaData: ClientMetaData = {
        idTokenSignedResponseAlg: 'RS256',
        idTokenEncryptedResponseAlg: 'RSA-OAEP',
        idTokenEncryptedResponseEnc: 'A256GCM',
        subjectSyntaxTypesSupported: ['urn:ietf:params:oauth:jwk-thumbprint'],
        jwkOption: EmbedOption.ByValue.INSTANCE,
        jarmOption: new JarmOption.Encrypted('ECDH-ES+A256KW', 'A256GCM'),
      };
      const responseMode = 'direct_post.jwt';
      const privateJWK = new EphemeralECDHPrivateJwk(
        '{"kty":"EC","crv":"P-256","x":"abc","y":"def","d":"secret","use":"sig"}'
      );

      const result = toClientMetaDataTO(
        requestId,
        clientMetaData,
        responseMode,
        privateJWK
      );

      expect(result).toEqual({
        id_token_signed_response_alg: 'RS256',
        id_token_encrypted_response_alg: 'RSA-OAEP',
        id_token_encrypted_response_enc: 'A256GCM',
        subject_syntax_types_supported: [
          'urn:ietf:params:oauth:jwk-thumbprint',
        ],
        jwks: {
          keys: [{ kty: 'EC', crv: 'P-256', x: 'abc', y: 'def', use: 'sig' }],
        },
        authorization_signed_response_alg: undefined,
        authorization_encrypted_response_alg: 'ECDH-ES+A256KW',
        authorization_encrypted_response_enc: 'A256GCM',
      });
    });
  });

  describe('toPayload', () => {
    it('should convert request object and client metadata to payload', () => {
      const clientMetaData: ClientMetaDataTO = {
        id_token_signed_response_alg: 'RS256',
        id_token_encrypted_response_alg: 'RSA-OAEP',
        id_token_encrypted_response_enc: 'A256GCM',
        subject_syntax_types_supported: [
          'urn:ietf:params:oauth:jwk-thumbprint',
        ],
      };
      const requestObject: RequestObject = {
        clientId: 'client123',
        aud: ['audience1'],
        responseType: ['code', 'id_token'],
        scope: ['openid', 'profile'],
        state: 'state123',
        nonce: 'nonce123',
        clientIdSchemeName: 'pre-registered',
        responseMode: 'direct_post',
        issuedAt: new Date('2023-06-08T10:00:00Z'),
        idTokenType: ['subject_signed'],
        presentationDefinition: {
          serialize: () => ({}),
        } as PresentationDefinition,
        presentationDefinitionUri: new URL('https://example.com/pd'),
        responseUri: new URL('https://example.com/response'),
      };

      const result = toPayload(requestObject, clientMetaData);

      expect(result).toEqual({
        iss: 'client123',
        aud: ['audience1'],
        response_type: 'code id_token',
        client_id: 'client123',
        scope: 'openid profile',
        state: 'state123',
        nonce: 'nonce123',
        client_id_scheme: 'pre-registered',
        iat: 1686218400,
        id_token_type: 'subject_signed',
        presentation_definition_uri: 'https://example.com/pd',
        response_mode: 'direct_post',
        client_metadata: clientMetaData,
        response_uri: 'https://example.com/response',
      });
    });
  });
});
