import { describe, it, expect } from 'vitest';

import {
  CompactEncrypt,
  generateKeyPair,
  jwtDecrypt,
  exportJWK,
  importJWK,
} from 'jose';
import { createVerifyJarmJwtJoseInvoker } from '../VerifyJarmJwtJose';
import { EphemeralECDHPrivateJwk, JarmOption } from '../../../../domain';
import { Id, PresentationSubmission } from '@vecrea/oid4vc-prex';

describe('VerifyJarmJwtJose', () => {
  describe('JWE', () => {
    it('should encrypt and decrypt', async () => {
      const recipientKeyPair = await generateKeyPair('ES256');
      const privateJwk = await exportJWK(recipientKeyPair.privateKey);
      const publicJwk = { ...privateJwk };
      delete publicJwk.d;

      const privateKey = await importJWK(privateJwk);
      const publicKey = await importJWK(publicJwk);

      const payload = {
        iss: 'iss',
        sub: 'sub',
        aud: 'aud',
      };

      const enc = new CompactEncrypt(
        new TextEncoder().encode(JSON.stringify(payload))
      ).setProtectedHeader({ alg: 'ECDH-ES+A256KW', enc: 'A256GCM' });

      const jwe = await enc.encrypt(publicKey);

      const decrypted = await jwtDecrypt(jwe, privateKey, {
        keyManagementAlgorithms: ['ECDH-ES+A256KW'],
        contentEncryptionAlgorithms: ['A256GCM'],
      });
      //console.log(decrypted.protectedHeader);

      expect(decrypted.protectedHeader.alg).toEqual('ECDH-ES+A256KW');
      expect(decrypted.protectedHeader.enc).toEqual('A256GCM');
      expect(decrypted.protectedHeader.epk).toEqual(
        expect.objectContaining({ crv: 'P-256', kty: 'EC' })
      );

      expect(decrypted.payload).toEqual(payload);
    });

    it('should decrypt JARM JWT and map claims to AuthorisationResponseTO', async () => {
      // Given
      const recipientKeyPair = await generateKeyPair('ECDH-ES');
      const privateJwk = await exportJWK(recipientKeyPair.privateKey);
      const publicJwk = { ...privateJwk };
      delete publicJwk.d;

      const publicKey = await importJWK(publicJwk);

      const payload = {
        vp_token: 'vpToken',
        presentation_submission: {
          id: 'id',
          definition_id: 'did',
          descriptor_map: [],
        },
      };

      const enc = new CompactEncrypt(
        new TextEncoder().encode(JSON.stringify(payload))
      ).setProtectedHeader({ alg: 'ECDH-ES+A256KW', enc: 'A256GCM' });

      const jarmJwt = await enc.encrypt(publicKey);
      const jarmOption = new JarmOption.Encrypted('ECDH-ES+A256KW', 'A256GCM');
      const ephemeralECDHPrivateJwk = new EphemeralECDHPrivateJwk(
        JSON.stringify(privateJwk)
      );

      const verifyJarmJwt = createVerifyJarmJwtJoseInvoker();
      const result = await verifyJarmJwt(
        jarmOption,
        ephemeralECDHPrivateJwk,
        jarmJwt
      );

      expect(result.isSuccess()).toBe(true);
      const to = result.getOrThrow();
      console.log(to);
      expect(to.vpToken).toEqual('vpToken');
      expect(to.presentationSubmission).toEqual(
        new PresentationSubmission(new Id('id'), new Id('did'), [])
      );
    });

    it('should return an error when JARM JWT decryption fails', async () => {
      // Given
      const recipientKeyPair = await generateKeyPair('ES256');
      const privateJwk = await exportJWK(recipientKeyPair.privateKey);

      const jarmJwt = 'invalid jarm JWT';
      const jarmOption = new JarmOption.Encrypted('ECDH-ES+A256KW', 'A256GCM');
      const ephemeralECDHPrivateJwk = new EphemeralECDHPrivateJwk(
        JSON.stringify(privateJwk)
      );

      const verifyJarmJwt = createVerifyJarmJwtJoseInvoker();
      const result = await verifyJarmJwt(
        jarmOption,
        ephemeralECDHPrivateJwk,
        jarmJwt
      );

      expect(result.isFailure()).toBe(true);
      const ex = result.error;
      expect(ex).toBeDefined();
    });
  });
});
