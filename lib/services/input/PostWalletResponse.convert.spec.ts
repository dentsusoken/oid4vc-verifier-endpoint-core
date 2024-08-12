import 'reflect-metadata';
import { describe, it, expect } from 'vitest';
import {
  AuthorizationResponse,
  RequestId,
  AuthorizationResponseData,
  JarmOption,
  EphemeralECDHPrivateJwk,
} from '../../domain';
import {
  getRequestId,
  toAuthorizationResponseData,
} from './PostWalletResponse.convert';
import { generateKeyPair, exportJWK, CompactEncrypt } from 'jose';
import { createVerifyJarmJwtJoseInvoker } from '../../adapters/out/jose';
import { PresentationSubmission } from 'oid4vc-prex';

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

  describe('toAuthorizationResponseData', async () => {
    const recipientKeyPair = await generateKeyPair('ES256');
    const privateJwk = await exportJWK(recipientKeyPair.privateKey);

    const presentationSubmission = {
      id: 'submission-id-1',
      definition_id: 'definition-id-1',
      descriptor_map: [
        {
          id: 'input-descriptor-id-1',
          format: 'jwt_vc',
          path: '$.verifiableCredential[0]',
        },
      ],
    };
    const presentationSubmissionJsonStr = JSON.stringify(
      presentationSubmission
    );

    const payload = {
      state: 'request-id',
      vpToken: 'vpToken',
      presentationSubmission: presentationSubmissionJsonStr,
    };

    const enc = new CompactEncrypt(
      new TextEncoder().encode(JSON.stringify(payload))
    ).setProtectedHeader({ alg: 'ECDH-ES+A256KW', enc: 'A256GCM' });

    const jarmJwt = await enc.encrypt(recipientKeyPair.publicKey);
    const jarmOption = new JarmOption.Encrypted('ECDH-ES+A256KW', 'A256GCM');
    const ephemeralECDHPrivateJwk: EphemeralECDHPrivateJwk = {
      value: JSON.stringify(privateJwk),
    };
    const verifyJarmJwt = createVerifyJarmJwtJoseInvoker();

    it('should return response data for DirectPost response', async () => {
      const response = new AuthorizationResponse.DirectPost(
        {} as AuthorizationResponseData
      );

      const result = await toAuthorizationResponseData(
        response,
        verifyJarmJwt,
        jarmOption,
        ephemeralECDHPrivateJwk
      );

      expect(result.isSuccess).toBe(true);
      const data = result.getOrThrow();
      expect(data).toEqual(response.response);
    });

    it('should return response data for other response types with valid JARM', async () => {
      const response = new AuthorizationResponse.DirectPostJwt(
        'request-id',
        jarmJwt
      );

      const result = await toAuthorizationResponseData(
        response,
        verifyJarmJwt,
        jarmOption,
        ephemeralECDHPrivateJwk
      );
      console.log(result);

      expect(result.isSuccess).toBe(true);
      const data = result.getOrThrow();
      expect(data.state).toBe(payload.state);
      expect(data.vpToken).toBe(payload.vpToken);
      expect(data.presentationSubmission).toBeDefined();
      expect(data.presentationSubmission).toBeInstanceOf(
        PresentationSubmission
      );
    });

    it('should throw error when incorrect state', async () => {
      const response = new AuthorizationResponse.DirectPostJwt(
        'incorrect-state',
        jarmJwt
      );

      const result = await toAuthorizationResponseData(
        response,
        verifyJarmJwt,
        jarmOption,
        ephemeralECDHPrivateJwk
      );
      console.log(result);

      expect(result.isFailure).toBe(true);
      const error = result.exceptionOrUndefined();
      expect(error?.message).toBe('Incorrect state');
    });
  });
});
