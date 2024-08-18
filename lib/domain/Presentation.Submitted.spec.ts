import 'reflect-metadata';
import { describe, it, expect } from 'vitest';
import {
  TransactionId,
  RequestId,
  Nonce,
  ResponseCode,
  PresentationType,
  IdTokenType,
  Presentation,
  WalletResponse,
} from '.';

describe('Submitted', () => {
  const id = new TransactionId('transaction-id');
  const initiatedAt = new Date('2023-06-01T10:00:00Z');
  const type = new PresentationType.IdTokenRequest([IdTokenType.SubjectSigned]);
  const requestId = new RequestId('request-id');
  const requestObjectRetrievedAt = new Date('2023-06-01T10:01:00Z');
  const submittedAt = new Date('2023-06-01T10:02:00Z');
  const walletResponse = new WalletResponse.IdToken('aa');
  const nonce = new Nonce('nonce');
  const responseCode = new ResponseCode('hoge');

  it('should create a Submitted instance', () => {
    const submitted = new Presentation.Submitted(
      id,
      initiatedAt,
      type,
      requestId,
      requestObjectRetrievedAt,
      submittedAt,
      walletResponse,
      nonce,
      responseCode
    );

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

  it('should throw an error if initiatedAt is in the future', () => {
    const futureDate = new Date(Date.now() + 1000);

    expect(() => {
      new Presentation.Submitted(
        id,
        futureDate,
        type,
        requestId,
        requestObjectRetrievedAt,
        submittedAt,
        walletResponse,
        nonce,
        responseCode
      );
    }).toThrowError('initiatedAt must be earlier than now');
  });

  describe('type guard', () => {
    it('should correctly identify Submitted using if statement', () => {
      const presentation = new Presentation.Submitted(
        id,
        initiatedAt,
        type,
        requestId,
        requestObjectRetrievedAt,
        submittedAt,
        walletResponse,
        nonce,
        responseCode
      );

      if (presentation.__type === 'Submitted') {
        expect(presentation.id).toBe(id);
        expect(presentation.initiatedAt).toBe(initiatedAt);
        expect(presentation.type).toBe(type);
        expect(presentation.requestId).toBe(requestId);
        expect(presentation.requestObjectRetrievedAt).toBe(
          requestObjectRetrievedAt
        );
        expect(presentation.submittedAt).toBe(submittedAt);
        expect(presentation.walletResponse).toBe(walletResponse);
        expect(presentation.nonce).toBe(nonce);
        expect(presentation.responseCode).toBe(responseCode);
      } else {
        throw new Error('Expected presentation to be of type Submitted');
      }
    });

    it('should correctly identify Submitted using switch statement', () => {
      const presentation = new Presentation.Submitted(
        id,
        initiatedAt,
        type,
        requestId,
        requestObjectRetrievedAt,
        submittedAt,
        walletResponse,
        nonce,
        responseCode
      );

      switch (presentation.__type) {
        case 'Submitted':
          expect(presentation.id).toBe(id);
          expect(presentation.initiatedAt).toBe(initiatedAt);
          expect(presentation.type).toBe(type);
          expect(presentation.requestId).toBe(requestId);
          expect(presentation.requestObjectRetrievedAt).toBe(
            requestObjectRetrievedAt
          );
          expect(presentation.submittedAt).toBe(submittedAt);
          expect(presentation.walletResponse).toBe(walletResponse);
          expect(presentation.nonce).toBe(nonce);
          expect(presentation.responseCode).toBe(responseCode);
          break;
        default:
          throw new Error('Expected presentation to be of type Submitted');
      }
    });
  });
});
