import { describe, it, expect } from 'vitest';
import {
  Presentation,
  PresentationJSON,
  TransactionId,
  RequestId,
  PresentationType,
  Nonce,
  EphemeralECDHPrivateJwk,
  ResponseModeOption,
  EmbedOption,
  GetWalletResponseMethod,
  ResponseCode,
} from '.';

describe('Presentation.fromJSON', () => {
  it('should create a Requested instance from JSON', () => {
    const json: PresentationJSON = {
      __type: 'Requested',
      id: 'transaction-id',
      initiated_at: '2023-06-08T10:00:00Z',
      type: {
        __type: 'VpTokenRequest',
        presentation_definition: {
          id: 'id',
        },
      },
      request_id: 'request-id',
      nonce: 'nonce-value',
      ephemeral_ecdh_private_jwk: 'private-jwk',
      response_mode: 'direct_post',
      presentation_definition_mode: {
        __type: 'ByValue',
      },
      get_wallet_response_method: {
        __type: 'Poll',
      },
    };

    const presentation = Presentation.fromJSON(json);

    if (presentation.__type !== 'Requested') {
      throw new Error('Expected Requested instance');
    }

    expect(presentation).toBeInstanceOf(Presentation.Requested);
    expect(presentation.id).toEqual(new TransactionId('transaction-id'));
    expect(presentation.initiatedAt).toEqual(new Date('2023-06-08T10:00:00Z'));
    expect(presentation.type).toBeInstanceOf(PresentationType.VpTokenRequest);
    expect(presentation.requestId).toEqual(new RequestId('request-id'));
    expect(presentation.nonce).toEqual(new Nonce('nonce-value'));
    expect(presentation.ephemeralECDHPrivateJwk).toEqual(
      new EphemeralECDHPrivateJwk('private-jwk')
    );
    expect(presentation.responseMode).toEqual(ResponseModeOption.DirectPost);
    expect(presentation.presentationDefinitionMode).toEqual(
      EmbedOption.ByValue.INSTANCE
    );
    expect(presentation.getWalletResponseMethod).toEqual(
      GetWalletResponseMethod.Poll.INSTANCE
    );
  });

  it('should create a RequestObjectRetrieved instance from JSON', () => {
    const json: PresentationJSON = {
      __type: 'RequestObjectRetrieved',
      id: 'transaction-id',
      initiated_at: '2023-06-08T10:00:00Z',
      type: {
        __type: 'VpTokenRequest',
        presentation_definition: { id: 'id' },
      },
      request_id: 'request-id',
      request_object_retrieved_at: '2023-06-08T10:05:00Z',
      nonce: 'nonce-value',
      ephemeral_ecdh_private_jwk: 'private-jwk',
      response_mode: 'direct_post',
      get_wallet_response_method: {
        __type: 'Poll',
      },
    };

    const presentation = Presentation.fromJSON(json);

    if (presentation.__type !== 'RequestObjectRetrieved') {
      throw new Error('Expected RequestObjectRetrieved instance');
    }

    expect(presentation).toBeInstanceOf(Presentation.RequestObjectRetrieved);
    expect(presentation.id).toEqual(new TransactionId('transaction-id'));
    expect(presentation.initiatedAt).toEqual(new Date('2023-06-08T10:00:00Z'));
    expect(presentation.type).toBeInstanceOf(PresentationType.VpTokenRequest);
    expect(presentation.requestId).toEqual(new RequestId('request-id'));
    expect(presentation.requestObjectRetrievedAt).toEqual(
      new Date('2023-06-08T10:05:00Z')
    );
    expect(presentation.nonce).toEqual(new Nonce('nonce-value'));
    expect(presentation.ephemeralECDHPrivateJwk).toEqual(
      new EphemeralECDHPrivateJwk('private-jwk')
    );
    expect(presentation.responseMode).toEqual(ResponseModeOption.DirectPost);
    expect(presentation.getWalletResponseMethod).toEqual(
      GetWalletResponseMethod.Poll.INSTANCE
    );
  });

  it('should create a Submitted instance from JSON', () => {
    const json: PresentationJSON = {
      __type: 'Submitted',
      id: 'transaction-id',
      initiated_at: '2023-06-08T10:00:00Z',
      type: {
        __type: 'VpTokenRequest',
        presentation_definition: { id: 'id' },
      },
      request_id: 'request-id',
      request_object_retrieved_at: '2023-06-08T10:05:00Z',
      submitted_at: '2023-06-08T10:10:00Z',
      wallet_response: {
        __type: 'IdToken',
        id_token: 'id-token-value',
      },
      nonce: 'nonce-value',
      response_code: 'response-code-value',
    };

    const presentation = Presentation.fromJSON(json);

    if (presentation.__type !== 'Submitted') {
      throw new Error('Expected Submitted instance');
    }

    expect(presentation).toBeInstanceOf(Presentation.Submitted);
    expect(presentation.id).toEqual(new TransactionId('transaction-id'));
    expect(presentation.initiatedAt).toEqual(new Date('2023-06-08T10:00:00Z'));
    expect(presentation.type).toBeInstanceOf(PresentationType.VpTokenRequest);
    expect(presentation.requestId).toEqual(new RequestId('request-id'));
    expect(presentation.requestObjectRetrievedAt).toEqual(
      new Date('2023-06-08T10:05:00Z')
    );
    expect(presentation.submittedAt).toEqual(new Date('2023-06-08T10:10:00Z'));
    expect(presentation.walletResponse).toMatchObject({
      __type: 'IdToken',
      idToken: 'id-token-value',
    });
    expect(presentation.nonce).toEqual(new Nonce('nonce-value'));
    expect(presentation.responseCode).toEqual(
      new ResponseCode('response-code-value')
    );
  });
});
