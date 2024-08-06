import { describe, it, expect } from 'vitest';
import { JWTDecryptResult } from 'jose';
import { PresentationExchange, PresentationSubmission } from 'oid4vc-prex';
//import { AuthorisationResponseTO } from '../../../ports/out/jose';
import { Result } from '../../../kotlin';
import { toAuthorizationResponseTO } from './VerifyJarmJwtJose.convert';

describe('toAuthorizationResponseTO', () => {
  it('should successfully convert JWT payload to AuthorisationResponseTO', async () => {
    const presentationSubmissionJson = JSON.stringify({
      id: 'submission-id-1',
      definition_id: 'definition-id-1',
      descriptor_map: [
        {
          id: 'input-descriptor-id-1',
          format: 'jwt_vc',
          path: '$.verifiableCredential[0]',
        },
      ],
    });

    const mockPayload: JWTDecryptResult['payload'] = {
      state: 'test-state',
      idToken: 'test-id-token',
      vpToken: 'test-vp-token',
      presentationSubmission: presentationSubmissionJson,
    };

    const result = await toAuthorizationResponseTO(mockPayload);

    expect(result.isSuccess).toBe(true);

    const authResponse = result.getOrThrow();
    expect(authResponse.state).toBe(mockPayload.state);
    expect(authResponse.idToken).toBe(mockPayload.idToken);
    expect(authResponse.vpToken).toBe(mockPayload.vpToken);

    const ps = authResponse.presentationSubmission as PresentationSubmission;
    expect(ps.id.value).toBe('submission-id-1');
    expect(ps.definitionId.value).toBe('definition-id-1');
    expect(ps.descriptorMaps).toHaveLength(1);
    expect(ps.descriptorMaps[0].id.value).toBe('input-descriptor-id-1');
    expect(ps.descriptorMaps[0].format).toBe('jwt_vc');
    expect(ps.descriptorMaps[0].path.value).toBe('$.verifiableCredential[0]');
  });

  it('should return an error result when presentationSubmission decoding fails', async () => {
    const mockPayload: JWTDecryptResult['payload'] = {
      state: 'test-state',
      presentationSubmission: 'invalid-submission',
    };

    const result = await toAuthorizationResponseTO(mockPayload);
    expect(result.isSuccess).toBe(false);
    console.log(result.exceptionOrNull()?.message);

    expect(() => result.getOrThrow()).toThrow();
  });

  it('should handle payload without presentationSubmission', async () => {
    const mockPayload: JWTDecryptResult['payload'] = {
      state: 'test-state',
      idToken: 'test-id-token',
    };

    const result = await toAuthorizationResponseTO(mockPayload);
    expect(result.isSuccess).toBe(true);

    const authResponse = result.getOrThrow();
    expect(authResponse).toEqual(mockPayload);
    expect(authResponse.presentationSubmission).toBeUndefined();
  });
});
