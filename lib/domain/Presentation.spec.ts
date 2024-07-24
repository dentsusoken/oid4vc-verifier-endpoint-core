import { ResponseModeOption } from '../index';
import { describe, expect, it } from 'vitest';
import {
  Presentation,
  TransactionId,
  RequestId,
  Nonce,
  PresentationType,
  ResponseCode,
} from './Presentation';

describe('Presentation', () => {
  describe('Requested', () => {
    it('should check if the presentation is expired', () => {
      const initiatedAt = new Date();
      const presentation = new Presentation.Requested(
        new TransactionId('transactionId'),
        initiatedAt,
        new PresentationType.VpTokenRequest('presentationType'),
        new RequestId('requestId'),
        new Nonce('nonce'),
        undefined,
        ResponseModeOption.DirectPostJwt,
        'presentationDefinitionMode',
        'getWalletResponseMethod'
      );

      const clock = new Date(initiatedAt.getTime() + 1000); // Add 1 second to initiatedAt
      expect(presentation.isExpired(clock)).toBe(true);

      const expiredClock = new Date(initiatedAt.getTime() - 1000); // Subtract 1 second from initiatedAt
      expect(presentation.isExpired(expiredClock)).toBe(false);
    });

    it('should retrieve the request object', () => {
      const initiatedAt = new Date();
      const presentation = new Presentation.Requested(
        new TransactionId('transactionId'),
        initiatedAt,
        new PresentationType.VpTokenRequest('presentationType'),
        new RequestId('requestId'),
        new Nonce('nonce'),
        undefined,
        ResponseModeOption.DirectPostJwt,
        'presentationDefinitionMode',
        'getWalletResponseMethod'
      );

      const clock = new Date(initiatedAt.getTime() + 1000); // Add 1 second to initiatedAt
      const result = presentation.retrieveRequestObject(clock);

      expect(result.isSuccess).toBe(true);
      expect(result.getOrNull()).toBeInstanceOf(
        Presentation.RequestObjectRetrieved
      );
    });

    it('should time out the presentation', () => {
      const presentation = new Presentation.Requested(
        new TransactionId('transactionId'),
        new Date(),
        new PresentationType.VpTokenRequest('presentationType'),
        new RequestId('requestId'),
        new Nonce('nonce'),
        undefined,
        ResponseModeOption.DirectPostJwt,
        'presentationDefinitionMode',
        'getWalletResponseMethod'
      );

      const clock = new Date();
      const result = presentation.timedOut(clock);

      expect(result.isSuccess).toBe(true);
      expect(result.getOrNull()).toBeInstanceOf(Presentation.TimedOut);
    });
  });

  describe('RequestObjectRetrieved', () => {
    it('should check if the presentation is expired', () => {
      const initiatedAt = new Date();
      const requestObjectRetrievedAt = new Date(initiatedAt.getTime() + 1000); // Add 1 second to initiatedAt
      const presentation =
        Presentation.RequestObjectRetrieved.requestObjectRetrieved(
          new Presentation.Requested(
            new TransactionId('transactionId'),
            initiatedAt,
            new PresentationType.VpTokenRequest('presentationType'),
            new RequestId('requestId'),
            new Nonce('nonce'),
            undefined,
            ResponseModeOption.DirectPostJwt,
            'presentationDefinitionMode',
            'getWalletResponseMethod'
          ),
          requestObjectRetrievedAt
        );

      expect(presentation.isSuccess).toBe(true);

      const expiredClock = new Date(requestObjectRetrievedAt.getTime() + 1000); // Subtract 1 second from requestObjectRetrievedAt
      expect(presentation.getOrNull()!.isExpired(expiredClock)).toBe(true);
    });

    it('should submit the presentation', () => {
      const initiatedAt = new Date();
      const presentation =
        Presentation.RequestObjectRetrieved.requestObjectRetrieved(
          new Presentation.Requested(
            new TransactionId('transactionId'),
            initiatedAt,
            new PresentationType.VpTokenRequest('presentationType'),
            new RequestId('requestId'),
            new Nonce('nonce'),
            undefined,
            ResponseModeOption.DirectPostJwt,
            'presentationDefinitionMode',
            'getWalletResponseMethod'
          ),
          initiatedAt
        ).getOrNull()!;

      const clock = new Date();
      const walletResponse = 'walletResponse';
      const result = presentation.submit(
        clock,
        walletResponse,
        new ResponseCode('200')
      );

      expect(result.isSuccess).toBe(true);
      expect(result.getOrNull()).toBeInstanceOf(Presentation.Submitted);
    });
  });

  describe('Submitted', () => {
    it('should check if the presentation is expired', () => {
      const initiatedAt = new Date();
      const submittedAt = new Date(initiatedAt.getTime() + 1000); // Add 1 second to initiatedAt
      const requestObjectRetrieved =
        Presentation.RequestObjectRetrieved.requestObjectRetrieved(
          new Presentation.Requested(
            new TransactionId('transactionId'),
            initiatedAt,
            new PresentationType.VpTokenRequest('presentationType'),
            new RequestId('requestId'),
            new Nonce('nonce'),
            undefined,
            ResponseModeOption.DirectPostJwt,
            'presentationDefinitionMode',
            'getWalletResponseMethod'
          ),
          initiatedAt
        );
      const presentation = Presentation.Submitted.submitted(
        requestObjectRetrieved.getOrNull()!,
        submittedAt,
        new PresentationType.VpTokenRequest('presentationType'),
        new RequestId('requestId')
      ).getOrNull()!;

      const clock = new Date(initiatedAt.getTime() + 1000); // Add 1 second to initiatedAt
      expect(presentation.isExpired(clock)).toBe(true);

      const expiredClock = new Date(initiatedAt.getTime() - 1000); // Subtract 1 second from initiatedAt
      expect(presentation.isExpired(expiredClock)).toBe(false);
    });

    it('should time out the presentation', () => {
      const initiatedAt = new Date();
      const submittedAt = new Date(initiatedAt.getTime() + 1000); // Add 1 second to initiatedAt
      const requestObjectRetrieved =
        Presentation.RequestObjectRetrieved.requestObjectRetrieved(
          new Presentation.Requested(
            new TransactionId('transactionId'),
            initiatedAt,
            new PresentationType.VpTokenRequest('presentationType'),
            new RequestId('requestId'),
            new Nonce('nonce'),
            undefined,
            ResponseModeOption.DirectPostJwt,
            'presentationDefinitionMode',
            'getWalletResponseMethod'
          ),
          initiatedAt
        );
      const presentation = Presentation.Submitted.submitted(
        requestObjectRetrieved.getOrNull()!,
        submittedAt,
        new PresentationType.VpTokenRequest('presentationType'),
        new RequestId('requestId')
      ).getOrNull()!;

      const clock = new Date();
      const result = presentation.timedOut(clock);

      expect(result.isSuccess).toBe(true);
      expect(result.getOrNull()).toBeInstanceOf(Presentation.TimedOut);
    });
  });

  describe('TimedOut', () => {
    it('should check if the presentation is expired', () => {
      const initiatedAt = new Date();
      const submittedAt = new Date(initiatedAt.getTime() + 1000); // Add 1 second to initiatedAt
      const requestObjectRetrieved =
        Presentation.RequestObjectRetrieved.requestObjectRetrieved(
          new Presentation.Requested(
            new TransactionId('transactionId'),
            initiatedAt,
            new PresentationType.VpTokenRequest('presentationType'),
            new RequestId('requestId'),
            new Nonce('nonce'),
            undefined,
            ResponseModeOption.DirectPostJwt,
            'presentationDefinitionMode',
            'getWalletResponseMethod'
          ),
          initiatedAt
        );
      const submitted = Presentation.Submitted.submitted(
        requestObjectRetrieved.getOrNull()!,
        submittedAt,
        new PresentationType.VpTokenRequest('presentationType'),
        new RequestId('requestId')
      ).getOrNull()!;
      const timedOutAt = new Date();
      const presentation = Presentation.TimedOut.timeOut(submitted, timedOutAt);

      expect(presentation.isSuccess).toBe(true);
      expect(presentation.getOrNull()?.isExpired(new Date())).toBe(false);
    });
  });
});
