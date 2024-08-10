import { describe, it, expect } from 'vitest';
import {
  TransactionId,
  RequestId,
  Nonce,
  EphemeralECDHPrivateJwk,
  ResponseModeOption,
  EmbedOption,
  GetWalletResponseMethodNS,
  IdTokenType,
  PresentationNS,
  PresentationTypeNS,
} from '.';

describe('Requested', () => {
  const id = new TransactionId('transaction-id');
  const initiatedAt = new Date('2023-06-08T10:00:00Z');
  const type = new PresentationTypeNS.IdTokenRequest([
    IdTokenType.SubjectSigned,
  ]);
  const requestId = new RequestId('request-id');
  const nonce = new Nonce('nonce');
  const ephemeralECDHPrivateJwk: EphemeralECDHPrivateJwk = {
    value: 'hoge',
  };
  const responseMode = ResponseModeOption.DirectPostJwt;
  const presentationDefinitionMode: EmbedOption<RequestId> =
    EmbedOption.ByValue.INSTANCE;
  const getWalletResponseMethod = new GetWalletResponseMethodNS.Redirect(
    'http://example.com/{requestId}'
  );

  it('should create an instance of Requested', () => {
    const requested = new PresentationNS.Requested(
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

  it('should check if the presentation is expired', () => {
    const requested = new PresentationNS.Requested(
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

    const notExpiredAt = new Date('2023-06-08T09:59:59Z');
    expect(requested.isExpired(notExpiredAt)).toBe(false);

    const expiredAt = new Date('2023-06-08T10:00:01Z');
    expect(requested.isExpired(expiredAt)).toBe(true);
  });

  it('should retrieve the request object', () => {
    const requested = new PresentationNS.Requested(
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
      PresentationNS.RequestObjectRetrieved
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

  it('should handle timeout', () => {
    const requested = new PresentationNS.Requested(
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

    const timeoutAt = new Date('2023-06-08T11:00:00Z');
    const result = requested.timedOut(timeoutAt);

    expect(result.isSuccess).toBe(true);
    const timedOut = result.getOrThrow();
    expect(timedOut.constructor).toBe(PresentationNS.TimedOut);
    expect(timedOut.id).toBe(id);
    expect(timedOut.initiatedAt).toBe(initiatedAt);
    expect(timedOut.type).toBe(type);
    expect(timedOut.requestObjectRetrievedAt).toBeUndefined();
    expect(timedOut.submittedAt).toBeUndefined();
    expect(timedOut.timedOutAt).toBe(timeoutAt);
  });

  it('should throw an error if initiatedAt is later than timeout date', () => {
    const requested = new PresentationNS.Requested(
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

    const invalidTimeoutAt = new Date('2023-06-08T09:59:59Z');
    const result = requested.timedOut(invalidTimeoutAt);

    expect(result.isFailure).toBe(true);
    expect(result.exceptionOrUndefined()).toBeInstanceOf(Error);
    expect(result.exceptionOrUndefined()?.message).toBe(
      'initiatedAt must be earlier than at'
    );
  });
});
