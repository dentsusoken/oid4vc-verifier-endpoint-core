import { describe, it, expect, vi } from 'vitest';
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
  PresentationRelatedUrlBuilder,
} from '../../../domain';
import { PresentationDefinition } from '../../../../mock/prex';

describe('requestObjectFromDomain', () => {
  const mockClock = { now: () => new Date('2023-01-01T00:00:00Z') };
  const clientId = 'client123';
  const jarSigning = new SigningConfig({ parsedX509CertChain: [] }, 'hoge');
  const clientIdScheme = new ClientIdScheme.PreRegistered(clientId, jarSigning);

  const urlBuilder: PresentationRelatedUrlBuilder<RequestId> = (
    id: RequestId
  ) => new URL(`https://example.com/direct_post/${id.value}`);
  const mockVerifierConfig = {
    clientIdScheme,
    responseUriBuilder: urlBuilder,
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
      new EmbedOption.ByValue(),
      new GetWalletResponseMethod.Poll()
    );

    const result = requestObjectFromDomain(
      mockVerifierConfig,
      mockClock,
      presentation
    );

    expect(result).toEqual({
      clientIdScheme,
      scope: ['openid'],
      idTokenType: ['attester_signed_id_token'],
      presentationDefinitionUri: null,
      presentationDefinition: null,
      responseType: ['id_token'],
      aud: [],
      nonce: 'test-nonce',
      state: 'test-request-id',
      responseMode: 'direct_post',
      responseUri: new URL('https://example.com/direct_post/test-request-id'),
      issuedAt: new Date('2023-01-01T00:00:00Z'),
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
      new EmbedOption.ByValue(),
      new GetWalletResponseMethod.Poll()
    );

    const result = requestObjectFromDomain(
      mockVerifierConfig,
      mockClock,
      presentation
    );

    expect(result).toEqual({
      clientIdScheme,
      scope: [],
      idTokenType: [],
      presentationDefinitionUri: null,
      presentationDefinition: mockPresentationDefinition,
      responseType: ['vp_token'],
      aud: ['https://self-issued.me/v2'],
      nonce: 'test-nonce',
      state: 'test-request-id',
      responseMode: 'direct_post.jwt',
      responseUri: new URL('https://example.com/direct_post/test-request-id'),
      issuedAt: new Date('2023-01-01T00:00:00Z'),
    });
  });

  it('should create a RequestObject for IdAndVpToken', () => {
    const mockPresentationDefinition = {} as PresentationDefinition;
    const presentation = new Presentation.Requested(
      new TransactionId('transaction-id'),
      new Date('2023-01-01T00:00:00Z'),
      new PresentationType.IdAndVpToken(
        [IdTokenType.SubjectSigned],
        mockPresentationDefinition
      ),
      new RequestId('test-request-id'),
      new Nonce('test-nonce'),
      undefined,
      ResponseModeOption.DirectPost,
      new EmbedOption.ByValue(),
      new GetWalletResponseMethod.Redirect('https://redirect.example.com')
    );

    const result = requestObjectFromDomain(
      mockVerifierConfig,
      mockClock,
      presentation
    );

    expect(result).toEqual({
      clientIdScheme,
      scope: ['openid'],
      idTokenType: ['subject_signed_id_token'],
      presentationDefinitionUri: null,
      presentationDefinition: mockPresentationDefinition,
      responseType: ['vp_token', 'id_token'],
      aud: ['https://self-issued.me/v2'],
      nonce: 'test-nonce',
      state: 'test-request-id',
      responseMode: 'direct_post',
      responseUri: new URL('https://example.com/direct_post/test-request-id'),
      issuedAt: new Date('2023-01-01T00:00:00Z'),
    });
  });
});
