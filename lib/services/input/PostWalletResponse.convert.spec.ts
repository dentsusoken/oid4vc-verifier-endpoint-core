import { describe, it, expect } from 'vitest';
import { AuthorizationResponse, RequestId } from '../../domain';
import { getRequestId } from './PostWalletResponse.convert';

describe('PostWalletResponse.convert', () => {
  describe('getRequestId', () => {
    it('should return RequestId for DirectPost response with state', () => {
      const response = new AuthorizationResponse.DirectPost({
        state: 'request-id',
      });

      const result = getRequestId(response);

      expect(result.isSuccess).toBe(true);
      const requestId = result.getOrThrow();
      expect(requestId).toBeInstanceOf(RequestId);
      expect(requestId.value).toBe('request-id');
    });

    it('should return RequestId for DirectPostJwt types with state', () => {
      const response = new AuthorizationResponse.DirectPostJwt(
        'request-id',
        'jarm'
      );

      const result = getRequestId(response);

      expect(result.isSuccess).toBe(true);
      const requestId = result.getOrThrow();
      expect(requestId).toBeInstanceOf(RequestId);
      expect(requestId.value).toBe('request-id');
    });

    it('should return failure result for DirectPost response without state', () => {
      const response = new AuthorizationResponse.DirectPost({});

      const result = getRequestId(response);

      expect(result.isFailure).toBe(true);
      const error = result.exceptionOrUndefined();
      expect(error).toBeInstanceOf(Error);
      expect(error?.message).toBe('Missing state');
    });

    it('should return failure result for other response types without state', () => {
      const response = new AuthorizationResponse.DirectPostJwt(
        undefined as unknown as string,
        'jarm'
      );

      const result = getRequestId(response);

      expect(result.isFailure).toBe(true);
      const error = result.exceptionOrUndefined();
      expect(error).toBeInstanceOf(Error);
      expect(error?.message).toBe('Missing state');
    });
  });
});
