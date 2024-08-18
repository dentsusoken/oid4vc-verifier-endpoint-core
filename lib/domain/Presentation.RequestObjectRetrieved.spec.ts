import 'reflect-metadata';
import { describe, it, expect } from 'vitest';
import {
  TransactionId,
  RequestId,
  Nonce,
  EphemeralECDHPrivateJwk,
  ResponseModeOption,
  GetWalletResponseMethod,
  IdTokenType,
  Presentation,
  PresentationType,
  ResponseCode,
  WalletResponse,
} from '.';
import { PresentationDefinition } from 'oid4vc-prex';

describe('RequestObjectRetrieved', () => {
  const id = new TransactionId('transaction-id');
  const initiatedAt = new Date('2023-06-08T10:00:00Z');
  const type = new PresentationType.IdTokenRequest([IdTokenType.SubjectSigned]);
  const requestId = new RequestId('request-id');
  const requestObjectRetrievedAt = new Date('2023-06-08T10:30:00Z');
  const nonce = new Nonce('nonce');
  const ephemeralECDHPrivateJwk: EphemeralECDHPrivateJwk = {
    value: 'hoge',
  };
  const responseMode = ResponseModeOption.DirectPostJwt;
  const getWalletResponseMethod = new GetWalletResponseMethod.Redirect(
    'http://example.com/{requestId}'
  );

  it('should create an instance of RequestObjectRetrieved', () => {
    const requestObjectRetrieved = new Presentation.RequestObjectRetrieved(
      id,
      initiatedAt,
      type,
      requestId,
      requestObjectRetrievedAt,
      nonce,
      ephemeralECDHPrivateJwk,
      responseMode,
      getWalletResponseMethod
    );

    expect(requestObjectRetrieved.id).toBe(id);
    expect(requestObjectRetrieved.initiatedAt).toBe(initiatedAt);
    expect(requestObjectRetrieved.type).toBe(type);
    expect(requestObjectRetrieved.requestId).toBe(requestId);
    expect(requestObjectRetrieved.requestObjectRetrievedAt).toBe(
      requestObjectRetrievedAt
    );
    expect(requestObjectRetrieved.nonce).toBe(nonce);
    expect(requestObjectRetrieved.ephemeralECDHPrivateJwk).toBe(
      ephemeralECDHPrivateJwk
    );
    expect(requestObjectRetrieved.responseMode).toBe(responseMode);
    expect(requestObjectRetrieved.getWalletResponseMethod).toBe(
      getWalletResponseMethod
    );
  });

  it('should throw an error if initiatedAt is later than requestObjectRetrievedAt', () => {
    const laterInitiatedAt = new Date('2023-06-08T11:00:00Z');
    expect(() => {
      new Presentation.RequestObjectRetrieved(
        id,
        laterInitiatedAt,
        type,
        requestId,
        requestObjectRetrievedAt,
        nonce,
        ephemeralECDHPrivateJwk,
        responseMode,
        getWalletResponseMethod
      );
    }).toThrow(
      'initiatedAt must be earlier than requestObjectRetrievedAt or equal to requestObjectRetrievedAtEpoc'
    );
  });

  it('should submit the presentation', () => {
    const requestObjectRetrieved = new Presentation.RequestObjectRetrieved(
      id,
      initiatedAt,
      type,
      requestId,
      requestObjectRetrievedAt,
      nonce,
      ephemeralECDHPrivateJwk,
      responseMode,
      getWalletResponseMethod
    );

    const submittedAt = new Date('2023-06-08T11:00:00Z');
    const walletResponse = new WalletResponse.IdToken('token');
    const responseCode: ResponseCode = {
      value: 'success',
    };

    const result = requestObjectRetrieved.submit(
      submittedAt,
      walletResponse,
      responseCode
    );

    expect(result.isSuccess).toBe(true);
    const submitted = result.getOrThrow();
    expect(submitted.constructor).toBe(Presentation.Submitted);
    expect(submitted.id).toBe(id);
    expect(submitted.initiatedAt).toBe(initiatedAt);
    expect(submitted.type).toBe(type);
    expect(submitted.requestId).toBe(requestId);
    expect(submitted.requestObjectRetrievedAt).toBe(requestObjectRetrievedAt);
    expect(submitted.submittedAt).toBe(submittedAt);
    expect(submitted.walletResponse).toBe(walletResponse);
    expect(submitted.nonce).toBe(nonce);
    expect(submitted.responseCode).toBe(responseCode);
  });

  describe('type guard', () => {
    it('should correctly identify RequestObjectRetrieved using if statement', () => {
      const presentation = new Presentation.RequestObjectRetrieved(
        id,
        initiatedAt,
        type,
        requestId,
        requestObjectRetrievedAt,
        nonce,
        ephemeralECDHPrivateJwk,
        responseMode,
        getWalletResponseMethod
      );

      if (presentation.__type === 'RequestObjectRetrieved') {
        expect(presentation.id).toBe(id);
        expect(presentation.initiatedAt).toBe(initiatedAt);
        expect(presentation.type).toBe(type);
        expect(presentation.requestId).toBe(requestId);
        expect(presentation.requestObjectRetrievedAt).toBe(
          requestObjectRetrievedAt
        );
        expect(presentation.nonce).toBe(nonce);
        expect(presentation.ephemeralECDHPrivateJwk).toBe(
          ephemeralECDHPrivateJwk
        );
        expect(presentation.responseMode).toBe(responseMode);
        expect(presentation.getWalletResponseMethod).toBe(
          getWalletResponseMethod
        );
      } else {
        throw new Error(
          'Expected presentation to be of type RequestObjectRetrieved'
        );
      }
    });

    it('should correctly identify RequestObjectRetrieved using switch statement', () => {
      const presentation = new Presentation.RequestObjectRetrieved(
        id,
        initiatedAt,
        type,
        requestId,
        requestObjectRetrievedAt,
        nonce,
        ephemeralECDHPrivateJwk,
        responseMode,
        getWalletResponseMethod
      );

      switch (presentation.__type) {
        case 'RequestObjectRetrieved':
          expect(presentation.id).toBe(id);
          expect(presentation.initiatedAt).toBe(initiatedAt);
          expect(presentation.type).toBe(type);
          expect(presentation.requestId).toBe(requestId);
          expect(presentation.requestObjectRetrievedAt).toBe(
            requestObjectRetrievedAt
          );
          expect(presentation.nonce).toBe(nonce);
          expect(presentation.ephemeralECDHPrivateJwk).toBe(
            ephemeralECDHPrivateJwk
          );
          expect(presentation.responseMode).toBe(responseMode);
          expect(presentation.getWalletResponseMethod).toBe(
            getWalletResponseMethod
          );
          break;
        default:
          throw new Error(
            'Expected presentation to be of type RequestObjectRetrieved'
          );
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
      const requestObjectRetrievedAt = new Date(0);
      const nonce = new Nonce('ghi789');
      const ephemeralECDHPrivateJwk = {
        value: 'hoge',
      } as EphemeralECDHPrivateJwk;
      const responseMode = ResponseModeOption.DirectPost;
      const getWalletResponseMethod = GetWalletResponseMethod.Poll.INSTANCE;

      const presentation = new Presentation.RequestObjectRetrieved(
        id,
        initiatedAt,
        type,
        requestId,
        requestObjectRetrievedAt,
        nonce,
        ephemeralECDHPrivateJwk,
        responseMode,
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
        request_object_retrieved_at: '1970-01-01T00:00:00.000Z',
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
