import { describe, it, expect, vi } from 'vitest';
import { exportJWK, generateKeyPair } from 'jose';
import {
  createSignRequestObjectJoseInvoker,
  invoke,
  sign,
  toPayload,
  toClientMetaData4Payload,
} from './SignRequestObjectJose';
import {
  ClientMetaData,
  EphemeralEncryptionKeyPairJWK,
  RequestId,
  ClientIdScheme,
  EmbedOption,
  VerifierConfig,
  Presentation,
  ResponseModeOption,
  PresentationRelatedUrlBuilder,
} from '../../../domain';
import { RequestObject, requestObjectFromDomain } from './RequestObject';
import { Result } from '../../../kotlin';
import { PresentationDefinition } from '../../../../mock/prex';

vi.mock('./RequestObject', () => ({
  requestObjectFromDomain: vi
    .fn()
    .mockImplementation((_verifierConfig, clock, presentation) => ({
      clientIdScheme: presentation.clientIdScheme,
      responseMode: 'direct_post',
      aud: ['mock-audience'],
      responseType: ['code'],
      scope: ['openid'],
      state: presentation.requestId.value,
      nonce: presentation.nonce.value,
      issuedAt: clock.now(),
      idTokenType: ['subject_signed_id_token'],
      presentationDefinition: null,
      presentationDefinitionUri: null,
      responseUri: new URL('https://example.com/response'),
    })),
}));

describe('SignRequestObjectJose', async () => {
  const keyPair = await generateKeyPair('ES256');
  const jwk = await exportJWK(keyPair.privateKey);
  const ephemeralKeyPair = await generateKeyPair('ES256');
  const ephemeralJwk = await exportJWK(ephemeralKeyPair.privateKey);
  const ephemeralKeyPairJWK = new EphemeralEncryptionKeyPairJWK(
    JSON.stringify(ephemeralJwk)
  );

  const mockRequestObject = {
    clientIdScheme: new ClientIdScheme.PreRegistered('client-id', {
      key: JSON.stringify(jwk!),
      algorithm: 'ES256',
    }),
    responseMode: 'direct_post',
    aud: ['audience'],
    responseType: ['code'],
    scope: ['openid'],
    state: 'state',
    nonce: 'nonce',
    idTokenType: ['subject_signed_id_token'],
    issuedAt: new Date('2023-01-01T00:00:00Z'),
    presentationDefinition: {} as PresentationDefinition,
    responseUri: new URL('https://example.com/direct_post'),
  } as RequestObject;

  const urlBuilder: PresentationRelatedUrlBuilder<RequestId> = (id) =>
    new URL(`https://example.com/${id.value}`);

  const mockRequestId = new RequestId('test-request-id');
  const mockClientMetaData = {
    jwkOption: new EmbedOption.ByValue(),
    idTokenSignedResponseAlg: 'ES256',
    idTokenEncryptedResponseAlg: 'ECDH-ES',
    idTokenEncryptedResponseEnc: 'A128CBC-HS256',
    subjectSyntaxTypesSupported: ['iss_sub'],
    jarmOption: {
      jwsAlg: () => undefined,
      jweAlg: () => 'jweAlg',
      encryptionMethod: () => 'encryptionMethod',
    },
  } as ClientMetaData;

  describe('createSignRequestObjectJoseInvoker', () => {
    it('should return a function', () => {
      const result = createSignRequestObjectJoseInvoker();
      expect(typeof result).toBe('function');
    });
  });

  describe('invoke', () => {
    it('should call requestObjectFromDomain and sign', async () => {
      const mockVerifierConfig: VerifierConfig = {
        clientMetaData: mockClientMetaData,
        clientIdScheme: new ClientIdScheme.PreRegistered('client-id', {
          key: JSON.stringify(jwk),
          algorithm: 'ES256',
        }),
        requestJarOption: new EmbedOption.ByValue(),
        presentationDefinitionEmbedOption: new EmbedOption.ByValue(),
        responseModeOption: ResponseModeOption.DirectPost,
        responseUriBuilder: () => new URL('https://example.com/response'),
        maxAge: 3600000,
      };
      const mockClock = { now: () => new Date('2023-01-01T00:00:00Z') };
      const mockPresentation = new Presentation.Requested(
        { value: 'mock-transaction-id' },
        new Date('2023-01-01T00:00:00Z'),
        { presentationDefinitionOrNull: () => undefined },
        mockRequestId,
        { value: 'mock-nonce' },
        ephemeralKeyPairJWK,
        ResponseModeOption.DirectPost,
        new EmbedOption.ByValue(),
        { Poll: {} }
      );

      const result = await invoke(
        mockVerifierConfig,
        mockClock,
        mockPresentation
      );

      expect(result).toBeInstanceOf(Result);
      expect(vi.mocked(requestObjectFromDomain)).toHaveBeenCalled();
      expect(vi.mocked(requestObjectFromDomain)).toHaveBeenCalledWith(
        mockVerifierConfig,
        mockClock,
        mockPresentation
      );
    });
  });

  describe('sign', () => {
    it('should create and sign a JWT', async () => {
      const result = await sign(
        mockRequestId,
        mockClientMetaData,
        ephemeralKeyPairJWK,
        mockRequestObject
      );

      expect(result).toBeInstanceOf(Result);
      if (result.isSuccess) {
        expect(typeof result.getOrNull()).toBe('string');
        expect(result.getOrNull()!.split('.').length).toBe(3); // JWT（header.payload.signature）
      }
    });
  });

  describe('toPayload', () => {
    it('should convert client metadata and request object to payload', () => {
      const mockClientMetaData4Payload = {
        id_token_signed_response_alg: 'ES256',
        id_token_encrypted_response_alg: 'ECDH-ES',
        id_token_encrypted_response_enc: 'A128CBC-HS256',
        subject_syntax_types_supported: ['iss_sub'],
      };
      const mockRequestObject2: RequestObject = {
        ...mockRequestObject,
        presentationDefinition: undefined,
        presentationDefinitionUri: new URL('https://example.com/'),
      };
      //delete mockRequestObject2.presentationDefinition;

      const result = toPayload(mockClientMetaData4Payload, mockRequestObject2);

      expect(result).toEqual({
        iss: 'client-id',
        aud: ['audience'],
        response_type: 'code',
        client_id: 'client-id',
        scope: 'openid',
        state: 'state',
        nonce: 'nonce',
        client_id_scheme: 'pre-registered',
        iat: 1672531200,

        id_token_type: 'subject_signed_id_token',
        client_metadata: mockClientMetaData4Payload,
        presentation_definition_uri: 'https://example.com/',
        response_uri: 'https://example.com/direct_post',
      });
    });
  });

  describe('toClientMetaData4Payload', () => {
    it('should convert client metadata to payload format', () => {
      const result = toClientMetaData4Payload(
        mockRequestId,
        mockClientMetaData,
        'direct_post.jwt',
        ephemeralKeyPairJWK
      );

      expect(result?.jwks?.keys[0].d).toBeUndefined();
      //console.log(result?.jwks?.keys[0]);

      expect(result).toEqual({
        id_token_signed_response_alg: 'ES256',
        id_token_encrypted_response_alg: 'ECDH-ES',
        id_token_encrypted_response_enc: 'A128CBC-HS256',
        subject_syntax_types_supported: ['iss_sub'],
        jwks: { keys: [expect.objectContaining({ kty: 'EC', crv: 'P-256' })] },
        authorization_encrypted_response_alg: 'jweAlg',
        authorization_encrypted_response_enc: 'encryptionMethod',
      });
    });

    it('should convert client metadata to payload format when jwkOption is ByReference', () => {
      const mockClientMetaData2 = { ...mockClientMetaData };
      mockClientMetaData2.jwkOption = new EmbedOption.ByReference(urlBuilder);

      const result = toClientMetaData4Payload(
        mockRequestId,
        mockClientMetaData2,
        'direct_post.jwt',
        ephemeralKeyPairJWK
      );

      expect(result).toEqual({
        id_token_signed_response_alg: 'ES256',
        id_token_encrypted_response_alg: 'ECDH-ES',
        id_token_encrypted_response_enc: 'A128CBC-HS256',
        subject_syntax_types_supported: ['iss_sub'],
        jwks_uri: 'https://example.com/test-request-id',
        authorization_encrypted_response_alg: 'jweAlg',
        authorization_encrypted_response_enc: 'encryptionMethod',
      });
    });

    it('should convert client metadata to payload format when response mode is dicrect_post', () => {
      const mockClientMetaData2 = { ...mockClientMetaData };
      mockClientMetaData2.jwkOption = new EmbedOption.ByReference(urlBuilder);

      const result = toClientMetaData4Payload(
        mockRequestId,
        mockClientMetaData2,
        'direct_post',
        ephemeralKeyPairJWK
      );

      expect(result).toEqual({
        id_token_signed_response_alg: 'ES256',
        id_token_encrypted_response_alg: 'ECDH-ES',
        id_token_encrypted_response_enc: 'A128CBC-HS256',
        subject_syntax_types_supported: ['iss_sub'],
        jwks_uri: 'https://example.com/test-request-id',
      });
    });
  });
});
