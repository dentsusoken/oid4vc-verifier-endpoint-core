import { describe, it, expect } from 'vitest';
import { JWTDecryptResult } from 'jose';
import { PresentationSubmission } from 'oid4vc-prex';
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

    const authResponse = await toAuthorizationResponseTO(mockPayload);

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

    await expect(toAuthorizationResponseTO(mockPayload)).rejects.toThrow(
      SyntaxError
    );
  });

  it('should handle payload without presentationSubmission', async () => {
    const mockPayload: JWTDecryptResult['payload'] = {
      state: 'test-state',
      idToken: 'test-id-token',
    };

    const authResponse = await toAuthorizationResponseTO(mockPayload);
    expect(authResponse).toEqual(mockPayload);
    expect(authResponse.presentationSubmission).toBeUndefined();
  });
});
