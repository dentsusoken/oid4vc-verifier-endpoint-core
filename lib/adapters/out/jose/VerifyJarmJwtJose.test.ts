import { describe, it, expect } from 'vitest';

import {
  CompactEncrypt,
  generateKeyPair,
  //compactDecrypt,
  jwtDecrypt,
  exportJWK,
  importJWK,
} from 'jose';
import { createVerifyJarmJwtJoseInvoker } from './VerifyJarmJwtJose';
//
import { EphemeralECDHPrivateJwk, JarmOptionNS } from '../../../domain';

describe('VerifyJarmJwtJose', () => {
  describe('JWE', () => {
    it('should encrypt and decrypt', async () => {
      const recipientKeyPair = await generateKeyPair('ES256');
      //console.log(recipientKeyPair);
      const privateJwk = await exportJWK(recipientKeyPair.privateKey);
      const publicJwk = { ...privateJwk };
      delete publicJwk.d;
      //console.log('privateJwk:', privateJwk);
      //console.log('publicJwk:', publicJwk);

      const privateKey = await importJWK(privateJwk);
      const publicKey = await importJWK(publicJwk);
      // console.log('privateKey:', privateKey);
      // console.log('publicKey:', publicKey);

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
      //console.log(decrypted);
      //console.log(jwe);

      // const decrypted = await compactDecrypt(jwe, recipientKeyPair.privateKey);
      //console.log(decrypted.protectedHeader);
      expect(decrypted.protectedHeader.alg).toEqual('ECDH-ES+A256KW');
      expect(decrypted.protectedHeader.enc).toEqual('A256GCM');
      expect(decrypted.protectedHeader.epk).toEqual(
        expect.objectContaining({ crv: 'P-256', kty: 'EC' })
      );

      // const decodedPayload = JSON.parse(
      //   new TextDecoder().decode(decrypted.plaintext)
      // );
      expect(decrypted.payload).toEqual(payload);
    });

    it('should decrypt JARM JWT and map claims to AuthorisationResponseTO', async () => {
      // Given
      const recipientKeyPair = await generateKeyPair('ES256');
      const privateJwk = await exportJWK(recipientKeyPair.privateKey);
      const publicJwk = { ...privateJwk };
      delete publicJwk.d;

      const publicKey = await importJWK(publicJwk);

      const payload = {
        iss: 'iss',
        sub: 'sub',
        aud: 'aud',
      };

      const enc = new CompactEncrypt(
        new TextEncoder().encode(JSON.stringify(payload))
      ).setProtectedHeader({ alg: 'ECDH-ES+A256KW', enc: 'A256GCM' });

      const jarmJwt = await enc.encrypt(publicKey);
      const jarmOption = new JarmOptionNS.Encrypted(
        'ECDH-ES+A256KW',
        'A256GCM'
      );
      const ephemeralPrivateJwk = new EphemeralEncryptionPrivateJwk(
        JSON.stringify(privateJwk)
      );

      const verifyJarmJwt = createVerifyJarmJwtJoseInvoker();
      const result = await verifyJarmJwt(
        jarmOption,
        ephemeralPrivateJwk,
        jarmJwt
      );

      expect(result.isSuccess).toBe(true);
      const to = result.getOrThrow();
      expect(to).toEqual(payload);
    });
  });
});
