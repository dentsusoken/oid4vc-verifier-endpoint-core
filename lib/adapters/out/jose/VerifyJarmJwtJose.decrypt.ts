/*
 * Copyright (c) 2023 European Commission
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { JWTDecryptResult, importJWK, jwtDecrypt, JWTPayload } from 'jose';

import { EphemeralECDHPrivateJwk, JarmOptionNS, Jwt } from '../../../domain';

export const decryptJarmJwt = async (
  jarmOption: JarmOption,
  ephemeralPrivateJwk: EphemeralECDHPrivateJwk | null,
  jarmJwt: Jwt
): Promise<JWTDecryptResult<JWTPayload>> => {
  if (JarmOptionNS.isSigned(jarmOption)) {
    throw new Error('Signed not supported yet');
  } else if (JarmOptionNS.isEncrypted(jarmOption)) {
    if (!ephemeralPrivateJwk) {
      throw new Error('Missing decryption key');
    }
    return decryptJarmJwtInternal(jarmOption, ephemeralPrivateJwk, jarmJwt);
  } else if (JarmOptionNS.isSignedAndEncrypted(jarmOption)) {
    throw new Error('SignedAndEncrypted not supported yet');
  } else {
    throw new Error('Unknown JarmOption type');
  }
};

export const decryptJarmJwtInternal = async (
  encrypted: JarmOptionNS.Encrypted,
  ephemeralPrivateJwk: EphemeralECDHPrivateJwk,
  jarmJwt: Jwt
): Promise<JWTDecryptResult<JWTPayload>> => {
  const privateJwk = JSON.parse(ephemeralPrivateJwk.value);
  const privateKey = await importJWK(privateJwk);

  return jwtDecrypt(jarmJwt, privateKey, {
    keyManagementAlgorithms: [encrypted.algorithm],
    contentEncryptionAlgorithms: [encrypted.encMethod],
  });
};
