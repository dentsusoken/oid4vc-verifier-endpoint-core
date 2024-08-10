import { describe, it, expect } from 'vitest';
import {
  TransactionId,
  RequestId,
  Nonce,
  EphemeralECDHPrivateJwk,
  ResponseModeOption,
  GetWalletResponseMethod,
  IdTokenType,
  PresentationNS,
  PresentationTypeNS,
  ResponseCode,
  WalletResponseNS,
} from '.';

describe('RequestObjectRetrieved', () => {
  const id = new TransactionId('transaction-id');
  const initiatedAt = new Date('2023-06-08T10:00:00Z');
  const type = new PresentationTypeNS.IdTokenRequest([
    IdTokenType.SubjectSigned,
  ]);
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
    const requestObjectRetrieved = new PresentationNS.RequestObjectRetrieved(
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
    expect(requestObjectRetrieved.ephemeralEcPrivateKey).toBe(
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
      new PresentationNS.RequestObjectRetrieved(
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

  it('should check if the presentation is expired', () => {
    const requestObjectRetrieved = new PresentationNS.RequestObjectRetrieved(
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

    const notExpiredAt = new Date('2023-06-08T10:29:59Z');
    expect(requestObjectRetrieved.isExpired(notExpiredAt)).toBe(false);

    const expiredAt = new Date('2023-06-08T10:30:01Z');
    expect(requestObjectRetrieved.isExpired(expiredAt)).toBe(true);
  });

  it('should submit the presentation', () => {
    const requestObjectRetrieved = new PresentationNS.RequestObjectRetrieved(
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
    const walletResponse = new WalletResponseNS.IdToken('token');
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
    expect(submitted.constructor).toBe(PresentationNS.Submitted);
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

  it('should handle timeout', () => {
    const requestObjectRetrieved = new PresentationNS.RequestObjectRetrieved(
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

    const timeoutAt = new Date('2023-06-08T12:00:00Z');
    const result = requestObjectRetrieved.timedOut(timeoutAt);

    expect(result.isSuccess).toBe(true);
    const timedOut = result.getOrThrow();
    expect(timedOut.constructor).toBe(PresentationNS.TimedOut);
    expect(timedOut.id).toBe(id);
    expect(timedOut.initiatedAt).toBe(initiatedAt);
    expect(timedOut.type).toBe(type);
    expect(timedOut.requestObjectRetrievedAt).toBe(requestObjectRetrievedAt);
    expect(timedOut.submittedAt).toBeUndefined();
    expect(timedOut.timedOutAt).toBe(timeoutAt);
  });

  it('should throw an error if initiatedAt is later than timeout date', () => {
    const requestObjectRetrieved = new PresentationNS.RequestObjectRetrieved(
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

    const invalidTimeoutAt = new Date('2023-06-08T09:59:59Z');
    const result = requestObjectRetrieved.timedOut(invalidTimeoutAt);

    expect(result.isFailure).toBe(true);
    expect(result.exceptionOrUndefined()?.message).toBe(
      'initiatedAt must be earlier than at'
    );
  });
});
