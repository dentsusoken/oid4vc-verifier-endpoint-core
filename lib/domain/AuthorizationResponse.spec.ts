import { describe, it, expect } from 'vitest';
import {
  AuthorizationResponse,
  AuthorizationResponseData,
} from './AuthorizationResponse';
import { PresentationSubmission } from 'oid4vc-prex';

describe('AuthorizationResponse', () => {
  describe('DirectPost', () => {
    it('should create a DirectPost instance', () => {
      const responseData: AuthorizationResponseData = {
        state: 'request123',
        idToken: 'id_token_value',
        vpToken: 'vp_token_value',
        presentationSubmission: {} as PresentationSubmission,
      };

      const directPost = new AuthorizationResponse.DirectPost(responseData);

      expect(directPost).toBeInstanceOf(AuthorizationResponse.DirectPost);
      expect(directPost.__type).toBe('DirectPost');
      expect(directPost.response).toEqual(responseData);
    });

    it('should handle partial response data', () => {
      const responseData: AuthorizationResponseData = {
        state: 'request123',
      };

      const directPost = new AuthorizationResponse.DirectPost(responseData);

      expect(directPost).toBeInstanceOf(AuthorizationResponse.DirectPost);
      expect(directPost.__type).toBe('DirectPost');
      expect(directPost.response).toEqual(responseData);
      expect(directPost.response.idToken).toBeUndefined();
      expect(directPost.response.vpToken).toBeUndefined();
      expect(directPost.response.presentationSubmission).toBeUndefined();
    });

    it('should handle error response', () => {
      const responseData: AuthorizationResponseData = {
        error: 'invalid_request',
        errorDescription: 'The request is missing a required parameter',
      };

      const directPost = new AuthorizationResponse.DirectPost(responseData);

      expect(directPost).toBeInstanceOf(AuthorizationResponse.DirectPost);
      expect(directPost.__type).toBe('DirectPost');
      expect(directPost.response).toEqual(responseData);
      expect(directPost.response.error).toBe('invalid_request');
      expect(directPost.response.errorDescription).toBe(
        'The request is missing a required parameter'
      );
    });
  });

  describe('DirectPostJwt', () => {
    it('should create a DirectPostJwt instance', () => {
      const state = 'state123';
      const jarm = 'jwt_token_value';

      const directPostJwt = new AuthorizationResponse.DirectPostJwt(
        state,
        jarm
      );

      expect(directPostJwt).toBeInstanceOf(AuthorizationResponse.DirectPostJwt);
      expect(directPostJwt.__type).toBe('DirectPostJwt');
      expect(directPostJwt.state).toBe(state);
      expect(directPostJwt.jarm).toBe(jarm);
    });
  });

  describe('Type narrowing', () => {
    it('should allow type narrowing using switch statement', () => {
      const directPost = new AuthorizationResponse.DirectPost({
        state: 'request123',
      });
      const directPostJwt = new AuthorizationResponse.DirectPostJwt(
        'state123',
        'jwt_token_value'
      );

      function handleResponse(response: AuthorizationResponse): string {
        switch (response.__type) {
          case 'DirectPost':
            return `DirectPost with state: ${response.response.state}`;
          case 'DirectPostJwt':
            return `DirectPostJwt with state: ${response.state} and JARM`;
        }
      }

      expect(handleResponse(directPost)).toBe(
        'DirectPost with state: request123'
      );
      expect(handleResponse(directPostJwt)).toBe(
        'DirectPostJwt with state: state123 and JARM'
      );
    });

    it('should allow type narrowing using if statement', () => {
      const response: AuthorizationResponse =
        new AuthorizationResponse.DirectPost({
          state: 'request123',
          idToken: 'id_token_value',
        });

      if (response.__type === 'DirectPost') {
        expect(response.response.state).toBe('request123');
        expect(response.response.idToken).toBe('id_token_value');
      } else {
        // This branch should not be reached in this test
        expect(true).toBe(false);
      }
    });
  });
});
