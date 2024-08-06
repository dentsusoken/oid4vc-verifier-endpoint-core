import { describe, it, expect } from 'vitest';
import { generateKeyPair, exportJWK, importJWK, CompactEncrypt } from 'jose';
import {
  decryptJarmJwt,
  decryptJarmJwtInternal,
} from './VerifyJarmJwtJose.decrypt';
import { JarmOptionNS, EphemeralECDHPrivateJwk } from '../../../domain';

describe('decryptJarmJwt', () => {
  it('should decrypt an encrypted JWT correctly', async () => {
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

    const jarmOption = new JarmOptionNS.Encrypted('ECDH-ES+A256KW', 'A256GCM');
    const ephemeralPrivateJwk = new EphemeralEncryptionPrivateJwk(
      JSON.stringify(privateJwk)
    );

    const result = await decryptJarmJwt(
      jarmOption,
      ephemeralPrivateJwk,
      jarmJwt
    );

    expect(result.payload).toEqual(payload);
  });

  it('should throw error for Signed JarmOption', async () => {
    const signedOption = new JarmOptionNS.Signed('ES256');
    await expect(decryptJarmJwt(signedOption, null, '')).rejects.toThrow(
      'Signed not supported yet'
    );
  });

  it('should throw error for SignedAndEncrypted JarmOption', async () => {
    const signedAndEncryptedOption = new JarmOptionNS.SignedAndEncrypted(
      new JarmOptionNS.Signed('ES256'),
      new JarmOptionNS.Encrypted('ECDH-ES+A256KW', 'A256GCM')
    );
    await expect(
      decryptJarmJwt(signedAndEncryptedOption, null, '')
    ).rejects.toThrow('SignedAndEncrypted not supported yet');
  });

  it('should throw error for missing decryption key', async () => {
    const encryptedOption = new JarmOptionNS.Encrypted(
      'ECDH-ES+A256KW',
      'A256GCM'
    );
    await expect(decryptJarmJwt(encryptedOption, null, '')).rejects.toThrow(
      'Missing decryption key'
    );
  });
});

describe('decryptJarmJwtInternal', () => {
  it('should decrypt JWT correctly', async () => {
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

    const encryptedOption = new JarmOptionNS.Encrypted(
      'ECDH-ES+A256KW',
      'A256GCM'
    );
    const ephemeralPrivateJwk = new EphemeralEncryptionPrivateJwk(
      JSON.stringify(privateJwk)
    );

    const result = await decryptJarmJwtInternal(
      encryptedOption,
      ephemeralPrivateJwk,
      jarmJwt
    );

    expect(result.payload).toEqual(payload);
  });
});
