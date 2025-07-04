import { describe, it, expect } from 'vitest';
import {
  TransactionId,
  RequestId,
  Nonce,
  ResponseCode,
  PresentationType,
  Presentation,
  WalletResponse,
  IdTokenType,
} from '.';
import { Id, PresentationDefinition } from '@vecrea/oid4vc-prex';

describe('Submitted', () => {
  const id = new TransactionId('transaction-id');
  const initiatedAt = new Date('2023-06-01T10:00:00Z');
  const type = new PresentationType.IdTokenRequest([IdTokenType.SubjectSigned]);
  const requestId = new RequestId('request-id');
  const requestObjectRetrievedAt = new Date('2023-06-01T10:01:00Z');
  const submittedAt = new Date('2023-06-01T10:02:00Z');
  const walletResponse = new WalletResponse.IdToken('aa');
  const nonce = new Nonce('nonce');
  const responseCode = new ResponseCode('response_code');

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

  describe('toJSON', () => {
    it('should return a JSON', () => {
      const id = new TransactionId('abc123');
      const initiatedAt = new Date(0);
      const type = new PresentationType.VpTokenRequest(
        new PresentationDefinition(new Id('id'))
      );
      const requestId = new RequestId('def456');
      const requestObjectRetrievedAt = new Date(0);
      const submittedAt = new Date(0);
      const nonce = new Nonce('ghi789');
      const responseCode = new ResponseCode('efg');

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

      const json = presentation.toJSON();

      expect(json).toEqual({
        __type: 'Submitted',
        id: 'abc123',
        initiated_at: '1970-01-01T00:00:00.000Z',
        type: {
          __type: 'VpTokenRequest',
          presentation_definition: {
            format: undefined,
            id: 'id',
            input_descriptors: undefined,
            name: undefined,
            purpose: undefined,
            submission_requirements: undefined,
          },
        },
        request_id: 'def456',
        request_object_retrieved_at: '1970-01-01T00:00:00.000Z',
        submitted_at: '1970-01-01T00:00:00.000Z',
        wallet_response: {
          __type: 'IdToken',
          id_token: 'aa',
        },
        nonce: 'ghi789',
        response_code: 'efg',
      });
    });
  });

  describe('fromJSON', () => {
    it('should create an instance of Submitted from JSON', () => {
      const json: Presentation.SubmittedJSON = {
        __type: 'Submitted',
        id: 'abc123',
        initiated_at: '1970-01-01T00:00:00.000Z',
        type: {
          __type: 'VpTokenRequest',
          presentation_definition: {
            id: 'id',
          },
        },
        request_id: 'def456',
        request_object_retrieved_at: '1970-01-01T00:00:00.000Z',
        submitted_at: '1970-01-01T00:00:00.000Z',
        wallet_response: {
          __type: 'IdToken',
          id_token: 'aa',
        },
        nonce: 'ghi789',
        response_code: 'efg',
      };

      const submitted = Presentation.Submitted.fromJSON(json);

      expect(submitted).toBeInstanceOf(Presentation.Submitted);
      expect(submitted.id).toEqual(new TransactionId('abc123'));
      expect(submitted.initiatedAt).toEqual(
        new Date('1970-01-01T00:00:00.000Z')
      );
      expect(submitted.type).toEqual(
        new PresentationType.VpTokenRequest(
          new PresentationDefinition(new Id('id'))
        )
      );
      expect(submitted.requestId).toEqual(new RequestId('def456'));
      expect(submitted.requestObjectRetrievedAt).toEqual(
        new Date('1970-01-01T00:00:00.000Z')
      );
      expect(submitted.submittedAt).toEqual(
        new Date('1970-01-01T00:00:00.000Z')
      );
      const expectedWalletResponse = new WalletResponse.IdToken('aa');
      expect(submitted.walletResponse).toMatchObject({
        __type: expectedWalletResponse.__type,
        idToken: expectedWalletResponse.idToken,
      });
      expect(submitted.nonce).toEqual(new Nonce('ghi789'));
      expect(submitted.responseCode).toEqual(new ResponseCode('efg'));
    });

    it('should create an instance of Submitted from JSON without responseCode', () => {
      const json: Presentation.SubmittedJSON = {
        __type: 'Submitted',
        id: 'abc123',
        initiated_at: '1970-01-01T00:00:00.000Z',
        type: {
          __type: 'VpTokenRequest',
          presentation_definition: {
            id: 'id',
          },
        },
        request_id: 'def456',
        request_object_retrieved_at: '1970-01-01T00:00:00.000Z',
        submitted_at: '1970-01-01T00:00:00.000Z',
        wallet_response: {
          __type: 'IdToken',
          id_token: 'aa',
        },
        nonce: 'ghi789',
      };

      const submitted = Presentation.Submitted.fromJSON(json);

      expect(submitted).toBeInstanceOf(Presentation.Submitted);
      expect(submitted.responseCode).toBeUndefined();
    });
  });
});
