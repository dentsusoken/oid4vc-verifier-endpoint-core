import { describe, it, expect } from 'vitest';
import { TransactionId, PresentationType, Presentation, IdTokenType } from '.';

describe('TimedOut', () => {
  const id = new TransactionId('transaction-id');
  const initiatedAt = new Date('2023-06-01T10:00:00Z');
  const type = new PresentationType.IdTokenRequest([IdTokenType.SubjectSigned]);
  const requestObjectRetrievedAt = new Date('2023-06-01T10:01:00Z');
  const submittedAt = new Date('2023-06-01T10:02:00Z');
  const timedOutAt = new Date('2023-06-01T10:03:00Z');

  it('should create a TimedOut instance', () => {
    const timedOut = new Presentation.TimedOut(
      id,
      initiatedAt,
      type,
      requestObjectRetrievedAt,
      submittedAt,
      timedOutAt
    );

    expect(timedOut.id).toBe(id);
    expect(timedOut.initiatedAt).toBe(initiatedAt);
    expect(timedOut.type).toBe(type);
    expect(timedOut.requestObjectRetrievedAt).toBe(requestObjectRetrievedAt);
    expect(timedOut.submittedAt).toBe(submittedAt);
    expect(timedOut.timedOutAt).toBe(timedOutAt);
  });

  it('should create a TimedOut instance with optional properties', () => {
    const timedOut = new Presentation.TimedOut(
      id,
      initiatedAt,
      type,
      undefined,
      undefined,
      timedOutAt
    );

    expect(timedOut.id).toBe(id);
    expect(timedOut.initiatedAt).toBe(initiatedAt);
    expect(timedOut.type).toBe(type);
    expect(timedOut.requestObjectRetrievedAt).toBeUndefined();
    expect(timedOut.submittedAt).toBeUndefined();
    expect(timedOut.timedOutAt).toBe(timedOutAt);
  });

  it('should always return false for isExpired', () => {
    const timedOut = new Presentation.TimedOut(
      id,
      initiatedAt,
      type,
      requestObjectRetrievedAt,
      submittedAt,
      timedOutAt
    );

    const futureDate = new Date(Date.now() + 1000);
    expect(timedOut.isExpired(futureDate)).toBe(false);

    const pastDate = new Date(Date.now() - 1000);
    expect(timedOut.isExpired(pastDate)).toBe(false);
  });

  describe('type guard', () => {
    it('should correctly identify TimedOut using if statement', () => {
      const presentation: Presentation = new Presentation.TimedOut(
        id,
        initiatedAt,
        type,
        requestObjectRetrievedAt,
        submittedAt,
        timedOutAt
      );

      if (presentation.__type === 'TimedOut') {
        expect(presentation.id).toBe(id);
        expect(presentation.initiatedAt).toBe(initiatedAt);
        expect(presentation.type).toBe(type);
        expect(presentation.requestObjectRetrievedAt).toBe(
          requestObjectRetrievedAt
        );
        expect(presentation.submittedAt).toBe(submittedAt);
        expect(presentation.timedOutAt).toBe(timedOutAt);
      } else {
        throw new Error('Expected presentation to be of type TimedOut');
      }
    });

    it('should correctly identify TimedOut using switch statement', () => {
      const presentation: Presentation = new Presentation.TimedOut(
        id,
        initiatedAt,
        type,
        requestObjectRetrievedAt,
        submittedAt,
        timedOutAt
      );

      switch (presentation.__type) {
        case 'TimedOut':
          expect(presentation.id).toBe(id);
          expect(presentation.initiatedAt).toBe(initiatedAt);
          expect(presentation.type).toBe(type);
          expect(presentation.requestObjectRetrievedAt).toBe(
            requestObjectRetrievedAt
          );
          expect(presentation.submittedAt).toBe(submittedAt);
          expect(presentation.timedOutAt).toBe(timedOutAt);
          break;
        default:
          throw new Error('Expected presentation to be of type TimedOut');
      }
    });
  });
});
