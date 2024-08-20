import 'reflect-metadata';
import { describe, it, expect } from 'vitest';
import { requestObjectFromDomain } from './RequestObject';
import {
  ClientIdScheme,
  VerifierConfig,
  Presentation,
  PresentationType,
  IdTokenType,
  EmbedOption,
  ResponseModeOption,
  SigningConfig,
  TransactionId,
  RequestId,
  Nonce,
  GetWalletResponseMethod,
  StaticSigningPrivateJwk,
  UrlBuilder,
} from '../../../domain';
import { PresentationDefinition } from 'oid4vc-prex';

describe('requestObjectFromDomain', () => {
  const issuedAt = new Date('2023-01-01T00:00:00Z');
  const now = () => issuedAt;
  const clientId = 'client123';
  const staticSigningPrivateJwk: StaticSigningPrivateJwk = {
    value: 'hoge',
  };
  const jarSigning: SigningConfig = {
    staticSigningPrivateJwk,
    algorithm: 'ES256',
  };
  const clientIdScheme = new ClientIdScheme.PreRegistered(clientId, jarSigning);

  const urlBuilder = new UrlBuilder.WithRequestId(
    `https://example.com/direct_post/`
  );
  const mockVerifierConfig = {
    clientIdScheme,
    responseUrlBuilder: urlBuilder,
  } as VerifierConfig;

  it('should create a RequestObject for IdTokenRequest', () => {
    const presentation = new Presentation.Requested(
      new TransactionId('transaction-id'),
      new Date('2023-01-01T00:00:00Z'),
      new PresentationType.IdTokenRequest([IdTokenType.AttesterSigned]),
      new RequestId('test-request-id'),
      new Nonce('test-nonce'),
      undefined,
      ResponseModeOption.DirectPost,
      EmbedOption.ByValue.INSTANCE,
      GetWalletResponseMethod.Poll.INSTANCE
    );

    const result = requestObjectFromDomain(
      mockVerifierConfig,
      now,
      presentation
    );

    expect(result).toEqual({
      clientId,
      clientIdSchemeName: 'pre-registered',
      scope: ['openid'],
      idTokenType: ['attester_signed_id_token'],
      presentationDefinitionUri: undefined,
      presentationDefinition: undefined,
      responseType: ['id_token'],
      aud: [],
      nonce: 'test-nonce',
      state: 'test-request-id',
      responseMode: 'direct_post',
      responseUri: new URL('https://example.com/direct_post/test-request-id'),
      issuedAt,
    });
  });

  it('should create a RequestObject for VpTokenRequest', () => {
    const mockPresentationDefinition = {} as PresentationDefinition;
    const presentation = new Presentation.Requested(
      new TransactionId('transaction-id'),
      new Date('2023-01-01T00:00:00Z'),
      new PresentationType.VpTokenRequest(mockPresentationDefinition),
      new RequestId('test-request-id'),
      new Nonce('test-nonce'),
      undefined,
      ResponseModeOption.DirectPostJwt,
      EmbedOption.ByValue.INSTANCE,
      GetWalletResponseMethod.Poll.INSTANCE
    );

    const result = requestObjectFromDomain(
      mockVerifierConfig,
      now,
      presentation
    );

    expect(result).toEqual({
      clientId,
      clientIdSchemeName: 'pre-registered',
      scope: [],
      idTokenType: [],
      presentationDefinitionUri: undefined,
      presentationDefinition: mockPresentationDefinition,
      responseType: ['vp_token'],
      aud: ['https://self-issued.me/v2'],
      nonce: 'test-nonce',
      state: 'test-request-id',
      responseMode: 'direct_post.jwt',
      responseUri: new URL('https://example.com/direct_post/test-request-id'),
      issuedAt,
    });
  });

  it('should create a RequestObject for IdAndVpToken', () => {
    const mockPresentationDefinition = {} as PresentationDefinition;
    const presentation = new Presentation.Requested(
      new TransactionId('transaction-id'),
      new Date('2023-01-01T00:00:00Z'),
      new PresentationType.IdAndVpTokenRequest(
        [IdTokenType.SubjectSigned],
        mockPresentationDefinition
      ),
      new RequestId('test-request-id'),
      new Nonce('test-nonce'),
      undefined,
      ResponseModeOption.DirectPost,
      EmbedOption.ByValue.INSTANCE,
      new GetWalletResponseMethod.Redirect('https://redirect.example.com')
    );

    const result = requestObjectFromDomain(
      mockVerifierConfig,
      now,
      presentation
    );

    expect(result).toEqual({
      clientId,
      clientIdSchemeName: 'pre-registered',
      scope: ['openid'],
      idTokenType: ['subject_signed_id_token'],
      presentationDefinitionUri: undefined,
      presentationDefinition: mockPresentationDefinition,
      responseType: ['vp_token', 'id_token'],
      aud: ['https://self-issued.me/v2'],
      nonce: 'test-nonce',
      state: 'test-request-id',
      responseMode: 'direct_post',
      responseUri: new URL('https://example.com/direct_post/test-request-id'),
      issuedAt,
    });
  });
});
