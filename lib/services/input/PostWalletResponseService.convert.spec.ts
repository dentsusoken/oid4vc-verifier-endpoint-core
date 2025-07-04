import { describe, it, expect } from 'vitest';
import {
  AuthorizationResponse,
  RequestId,
  AuthorizationResponseData,
  JarmOption,
  EphemeralECDHPrivateJwk,
  PresentationType,
  WalletResponse,
  ResponseModeOption,
} from '../../domain';
import {
  getRequestId,
  toAuthorizationResponseData,
  toWalletResponse,
  getReponseModeOption,
} from './PostWalletResponseService.convert';
import { generateKeyPair, exportJWK, CompactEncrypt } from 'jose';
import { createVerifyJarmJwtJoseInvoker } from '../../adapters/out/jose';
import { PresentationDefinition, PresentationSubmission } from 'oid4vc-prex';

describe('PostWalletResponse.convert', () => {
  describe('getRequestId', () => {
    it('should return RequestId for DirectPost response with state', () => {
      const response = new AuthorizationResponse.DirectPost({
        state: 'request-id',
      });

      const requestId = getRequestId(response);

      expect(requestId).toBeInstanceOf(RequestId);
      expect(requestId.value).toBe('request-id');
    });

    it('should return RequestId for DirectPostJwt types with state', () => {
      const response = new AuthorizationResponse.DirectPostJwt(
        'request-id',
        'jarm'
      );

      const requestId = getRequestId(response);

      expect(requestId).toBeInstanceOf(RequestId);
      expect(requestId.value).toBe('request-id');
    });

    it('should return failure result for DirectPost response without state', () => {
      const response = new AuthorizationResponse.DirectPost({});

      expect(() => getRequestId(response)).toThrow('Missing state');
    });

    it('should return failure result for other response types without state', () => {
      const response = new AuthorizationResponse.DirectPostJwt(
        undefined as unknown as string,
        'jarm'
      );

      expect(() => getRequestId(response)).toThrow('Missing state');
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

    const payload = {
      state: 'request-id',
      vp_token: 'vpToken',
      presentation_submission: presentationSubmission,
    };

    const enc = new CompactEncrypt(
      new TextEncoder().encode(JSON.stringify(payload))
    ).setProtectedHeader({ alg: 'ECDH-ES+A256KW', enc: 'A256GCM' });

    const jarmJwt = await enc.encrypt(recipientKeyPair.publicKey);
    const jarmOption = new JarmOption.Encrypted('ECDH-ES+A256KW', 'A256GCM');
    const ephemeralECDHPrivateJwk = new EphemeralECDHPrivateJwk(
      JSON.stringify(privateJwk)
    );
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

      expect(result).toEqual(response.response);
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

      expect(result.state).toBe(payload.state);
      expect(result.vpToken).toBe(payload.vp_token);
      expect(result.presentationSubmission).toBeDefined();
      expect(result.presentationSubmission).toBeInstanceOf(
        PresentationSubmission
      );
    });

    it('should throw error when incorrect state', async () => {
      const response = new AuthorizationResponse.DirectPostJwt(
        'incorrect-state',
        jarmJwt
      );

      await expect(
        toAuthorizationResponseData(
          response,
          verifyJarmJwt,
          jarmOption,
          ephemeralECDHPrivateJwk
        )
      ).rejects.toThrow('Incorrect state');
    });
  });

  describe('toWalletResponse', () => {
    it('should return WalletResponseError when authzData has an error', () => {
      const authzData: AuthorizationResponseData = {
        error: 'invalid_request',
        errorDescription: 'Invalid request',
      };
      const presentationType = new PresentationType.IdTokenRequest([]);

      const result = toWalletResponse(authzData, presentationType);

      expect(result).toBeInstanceOf(WalletResponse.WalletResponseError);
      expect(result.__type === 'WalletResponseError' && result.value).toBe(
        'invalid_request'
      );
      expect(
        result.__type === 'WalletResponseError' && result.description
      ).toBe('Invalid request');
    });

    it('should return IdToken for IdTokenRequest when authzData has idToken', () => {
      const authzData: AuthorizationResponseData = {
        idToken: 'id-token',
      };
      const presentationType = new PresentationType.IdTokenRequest([]);

      const result = toWalletResponse(authzData, presentationType);

      expect(result).toBeInstanceOf(WalletResponse.IdToken);
      expect(result.__type === 'IdToken' && result.idToken).toBe('id-token');
    });

    it('should throw an error for IdTokenRequest when idToken is missing', () => {
      const authzData: AuthorizationResponseData = {};
      const presentationType = new PresentationType.IdTokenRequest([]);

      expect(() => toWalletResponse(authzData, presentationType)).toThrowError(
        'Missing idToken'
      );
    });

    it('should return VpToken for VpTokenRequest when authzData has vpToken and presentationSubmission', () => {
      const authzData: AuthorizationResponseData = {
        vpToken: 'vp-token',
        presentationSubmission: {} as PresentationSubmission,
      };
      const presentationType = new PresentationType.VpTokenRequest(
        {} as PresentationDefinition
      );

      const result = toWalletResponse(authzData, presentationType);

      expect(result).toBeInstanceOf(WalletResponse.VpToken);
      expect(result.__type === 'VpToken' && result.vpToken).toBe('vp-token');
      expect(result.__type === 'VpToken' && result.presentationSubmission).toBe(
        authzData.presentationSubmission
      );
    });

    it('should throw an error for VpTokenRequest when vpToken is missing', () => {
      const authzData: AuthorizationResponseData = {
        presentationSubmission: {} as PresentationSubmission,
      };
      const presentationType = new PresentationType.VpTokenRequest(
        {} as PresentationDefinition
      );

      expect(() => toWalletResponse(authzData, presentationType)).toThrowError(
        'Missing vpToken'
      );
    });

    it('should throw an error for VpTokenRequest when presentationSubmission is missing', () => {
      const authzData: AuthorizationResponseData = {
        vpToken: 'vp-token',
      };
      const presentationType = new PresentationType.VpTokenRequest(
        {} as PresentationDefinition
      );

      expect(() => toWalletResponse(authzData, presentationType)).toThrowError(
        'Missing presentation submission'
      );
    });

    it('should return IdAndVpToken for IdAndVpTokenRequest when authzData has idToken, vpToken, and presentationSubmission', () => {
      const authzData: AuthorizationResponseData = {
        idToken: 'id-token',
        vpToken: 'vp-token',
        presentationSubmission: {} as PresentationSubmission,
      };
      const presentationType = new PresentationType.IdAndVpTokenRequest(
        [],
        {} as PresentationDefinition
      );

      const result = toWalletResponse(authzData, presentationType);

      expect(result).toBeInstanceOf(WalletResponse.IdAndVpToken);
      expect(result.__type === 'IdAndVpToken' && result.idToken).toBe(
        'id-token'
      );
      expect(result.__type === 'IdAndVpToken' && result.vpToken).toBe(
        'vp-token'
      );
      expect(
        result.__type === 'IdAndVpToken' && result.presentationSubmission
      ).toBe(authzData.presentationSubmission);
    });

    it('should throw an error for IdAndVpTokenRequest when idToken is missing', () => {
      const authzData: AuthorizationResponseData = {
        vpToken: 'vp-token',
        presentationSubmission: {} as PresentationSubmission,
      };
      const presentationType = new PresentationType.IdAndVpTokenRequest(
        [],
        {} as PresentationDefinition
      );

      expect(() => toWalletResponse(authzData, presentationType)).toThrowError(
        'Missing idToken'
      );
    });

    it('should throw an error for IdAndVpTokenRequest when vpToken is missing', () => {
      const authzData: AuthorizationResponseData = {
        idToken: 'id-token',
        presentationSubmission: {} as PresentationSubmission,
      };
      const presentationType = new PresentationType.IdAndVpTokenRequest(
        [],
        {} as PresentationDefinition
      );

      expect(() => toWalletResponse(authzData, presentationType)).toThrowError(
        'Missing vpToken'
      );
    });

    it('should throw an error for IdAndVpTokenRequest when presentationSubmission is missing', () => {
      const authzData: AuthorizationResponseData = {
        idToken: 'id-token',
        vpToken: 'vp-token',
      };
      const presentationType = new PresentationType.IdAndVpTokenRequest(
        [],
        {} as PresentationDefinition
      );

      expect(() => toWalletResponse(authzData, presentationType)).toThrowError(
        'Missing presentation submission'
      );
    });
  });

  describe('getReponseModeOption', () => {
    it('should return ResponseModeOption.DirectPost for DirectPost response', () => {
      const response = new AuthorizationResponse.DirectPost(
        {} as AuthorizationResponseData
      );

      const result = getReponseModeOption(response);

      expect(result).toBe(ResponseModeOption.DirectPost);
    });

    it('should return ResponseModeOption.DirectPostJwt for other response types', () => {
      const response = new AuthorizationResponse.DirectPostJwt('', '');

      const result = getReponseModeOption(response);

      expect(result).toBe(ResponseModeOption.DirectPostJwt);
    });
  });
});
