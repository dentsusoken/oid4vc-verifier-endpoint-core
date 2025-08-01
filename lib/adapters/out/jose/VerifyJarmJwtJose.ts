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

import { VerifyJarmJwt } from '../../../ports/out/jose';
import { decryptJarmJwt } from './VerifyJarmJwtJose.decrypt';
import { toAuthorizationResponseData } from './VerifyJarmJwtJose.convert';
import { runAsyncCatching } from '@vecrea/oid4vc-core/utils';

export const createVerifyJarmJwtJoseInvoker = (): VerifyJarmJwt => invoke;

/**
 * Decrypts an encrypted JWT and maps the JWT claimSet to an AuthorisationResponseTO
 */
const invoke: VerifyJarmJwt = async (
  jarmOption,
  ephemeralPrivateJwk,
  jarmJwt
) =>
  runAsyncCatching(async () => {
    const decryptedJwt = await decryptJarmJwt(
      jarmOption,
      ephemeralPrivateJwk,
      jarmJwt
    );
    return toAuthorizationResponseData(decryptedJwt.payload);
  });
