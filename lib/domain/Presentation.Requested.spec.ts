import 'reflect-metadata';
import { describe, it, expect } from 'vitest';
import {
  TransactionId,
  RequestId,
  Nonce,
  EphemeralECDHPrivateJwk,
  ResponseModeOption,
  EmbedOption,
  GetWalletResponseMethod,
  IdTokenType,
  Presentation,
  PresentationType,
} from '.';
import { PresentationDefinition } from 'oid4vc-prex';

describe('Requested', () => {
  const id = new TransactionId('transaction-id');
  const initiatedAt = new Date('2023-06-08T10:00:00Z');
  const type = new PresentationType.IdTokenRequest([IdTokenType.SubjectSigned]);
  const requestId = new RequestId('request-id');
  const nonce = new Nonce('nonce');
  const ephemeralECDHPrivateJwk: EphemeralECDHPrivateJwk = {
    value: 'hoge',
  };
  const responseMode = ResponseModeOption.DirectPostJwt;
  const presentationDefinitionMode: EmbedOption<RequestId> =
    EmbedOption.ByValue.INSTANCE;
  const getWalletResponseMethod = new GetWalletResponseMethod.Redirect(
    'http://example.com/{requestId}'
  );

  it('should create an instance of Requested', () => {
    const requested = new Presentation.Requested(
      id,
      initiatedAt,
      type,
      requestId,
      nonce,
      ephemeralECDHPrivateJwk,
      responseMode,
      presentationDefinitionMode,
      getWalletResponseMethod
    );

    expect(requested.id).toBe(id);
    expect(requested.initiatedAt).toBe(initiatedAt);
    expect(requested.type).toBe(type);
    expect(requested.requestId).toBe(requestId);
    expect(requested.nonce).toBe(nonce);
    expect(requested.ephemeralECDHPrivateJwk).toBe(ephemeralECDHPrivateJwk);
    expect(requested.responseMode).toBe(responseMode);
    expect(requested.presentationDefinitionMode).toBe(
      presentationDefinitionMode
    );
    expect(requested.getWalletResponseMethod).toBe(getWalletResponseMethod);
  });

  it('should retrieve the request object', () => {
    const requested = new Presentation.Requested(
      id,
      initiatedAt,
      type,
      requestId,
      nonce,
      ephemeralECDHPrivateJwk,
      responseMode,
      presentationDefinitionMode,
      getWalletResponseMethod
    );

    const retrievedAt = new Date('2023-06-08T10:30:00Z');
    const result = requested.retrieveRequestObject(retrievedAt);

    expect(result.isSuccess).toBe(true);
    const requestObjectRetrieved = result.getOrThrow();
    expect(requestObjectRetrieved.constructor).toBe(
      Presentation.RequestObjectRetrieved
    );
    expect(requestObjectRetrieved.id).toBe(id);
    expect(requestObjectRetrieved.initiatedAt).toBe(initiatedAt);
    expect(requestObjectRetrieved.type).toBe(type);
    expect(requestObjectRetrieved.requestId).toBe(requestId);
    expect(requestObjectRetrieved.nonce).toBe(nonce);
    expect(requestObjectRetrieved.requestObjectRetrievedAt).toBe(retrievedAt);
    expect(requestObjectRetrieved.responseMode).toBe(responseMode);
    expect(requestObjectRetrieved.getWalletResponseMethod).toBe(
      getWalletResponseMethod
    );
  });

  describe('type guard', () => {
    it('should correctly identify Requested using if statement', () => {
      const presentation: Presentation = new Presentation.Requested(
        id,
        initiatedAt,
        type,
        requestId,
        nonce,
        ephemeralECDHPrivateJwk,
        responseMode,
        presentationDefinitionMode,
        getWalletResponseMethod
      );

      if (presentation.__type === 'Requested') {
        expect(presentation.id).toBe(id);
        expect(presentation.initiatedAt).toBe(initiatedAt);
        expect(presentation.type).toBe(type);
        expect(presentation.requestId).toBe(requestId);
        expect(presentation.nonce).toBe(nonce);
        expect(presentation.ephemeralECDHPrivateJwk).toBe(
          ephemeralECDHPrivateJwk
        );
        expect(presentation.responseMode).toBe(responseMode);
        expect(presentation.presentationDefinitionMode).toBe(
          presentationDefinitionMode
        );
        expect(presentation.getWalletResponseMethod).toBe(
          getWalletResponseMethod
        );
      } else {
        throw new Error('Expected presentation to be of type Requested');
      }
    });

    it('should correctly identify Requested using switch statement', () => {
      const presentation: Presentation = new Presentation.Requested(
        id,
        initiatedAt,
        type,
        requestId,
        nonce,
        ephemeralECDHPrivateJwk,
        responseMode,
        presentationDefinitionMode,
        getWalletResponseMethod
      );

      switch (presentation.__type) {
        case 'Requested':
          expect(presentation.id).toBe(id);
          expect(presentation.initiatedAt).toBe(initiatedAt);
          expect(presentation.type).toBe(type);
          expect(presentation.requestId).toBe(requestId);
          expect(presentation.nonce).toBe(nonce);
          expect(presentation.ephemeralECDHPrivateJwk).toBe(
            ephemeralECDHPrivateJwk
          );
          expect(presentation.responseMode).toBe(responseMode);
          expect(presentation.presentationDefinitionMode).toBe(
            presentationDefinitionMode
          );
          expect(presentation.getWalletResponseMethod).toBe(
            getWalletResponseMethod
          );
          break;
        default:
          throw new Error('Expected presentation to be of type Requested');
      }
    });
  });

  describe('toJSON', () => {
    it('should return a JSON', () => {
      const id = new TransactionId('abc123');
      const initiatedAt = new Date(0);
      const type = new PresentationType.VpTokenRequest(
        new PresentationDefinition()
      );
      const requestId = new RequestId('def456');
      const nonce = new Nonce('ghi789');
      const ephemeralECDHPrivateJwk = {
        value: 'hoge',
      } as EphemeralECDHPrivateJwk;
      const responseMode = ResponseModeOption.DirectPost;
      const presentationDefinitionMode = EmbedOption.ByValue.INSTANCE;
      const getWalletResponseMethod = GetWalletResponseMethod.Poll.INSTANCE;

      const presentation = new Presentation.Requested(
        id,
        initiatedAt,
        type,
        requestId,
        nonce,
        ephemeralECDHPrivateJwk,
        responseMode,
        presentationDefinitionMode,
        getWalletResponseMethod
      );

      const json = presentation.toJSON();

      expect(json).toEqual({
        id: 'abc123',
        initiated_at: '1970-01-01T00:00:00.000Z',
        type: {
          __type: 'VpTokenRequest',
          presentation_definition: {},
        },
        request_id: 'def456',
        nonce: 'ghi789',
        ephemeral_ecdh_private_jwk: 'hoge',
        response_mode: 'direct_post',
        get_wallet_response_method: {
          __type: 'Poll',
        },
      });
    });
  });
});
