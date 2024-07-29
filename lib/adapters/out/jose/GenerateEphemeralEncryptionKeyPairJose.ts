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

import { generateKeyPair, exportJWK } from 'jose';
import { v4 as uuidv4 } from 'uuid';
import { EphemeralEncryptionKeyPairJWK, JarmOption } from '../../../domain';
import { GenerateEphemeralEncryptionKeyPair } from '../../../ports/out/jose';
import { Result, runAsyncCatching } from '../../../kotlin';

export const createGenerateEphemeralEncryptionKeyPairInvoker =
  (): GenerateEphemeralEncryptionKeyPair => (encryptedResponse) =>
    invoke(encryptedResponse);

/**
 * An implementation of GenerateEphemeralEncryptionKeyPair that uses the jose library
 */
const invoke: GenerateEphemeralEncryptionKeyPair = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _encryptedResponse: JarmOption.Encrypted
): Promise<Result<EphemeralEncryptionKeyPairJWK>> =>
  runAsyncCatching(async () => {
    const { privateKey } = await generateKeyPair('ES256');
    const jwk = await exportJWK(privateKey);
    jwk.kid = uuidv4();
    jwk.use = 'enc';
    return new EphemeralEncryptionKeyPairJWK(JSON.stringify(jwk));
  });
