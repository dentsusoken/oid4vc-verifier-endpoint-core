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

import { Result } from '../../../kotlin';
import { EphemeralECDHPrivateJwk, JarmOptionNS, Jwt } from '../../../domain';
import { VerifyJarmJwt } from '../../../ports/out/jose';
import { decryptJarmJwt } from './VerifyJarmJwtJose.decrypt';
import { toAuthorizationResponseTO } from './VerifyJarmJwtJose.convert';
import { AuthorisationResponseTO } from '../../../../mock/prex';

export const createVerifyJarmJwtJoseInvoker = (): VerifyJarmJwt => invoke;

/**
 * Decrypts an encrypted JWT and maps the JWT claimSet to an AuthorisationResponseTO
 */
const invoke: VerifyJarmJwt = async (
  jarmOption: JarmOption,
  ephemeralPrivateJwk: EphemeralECDHPrivateJwk | null,
  jarmJwt: Jwt
): Promise<Result<AuthorisationResponseTO>> => {
  const decryptedJwt = await decryptJarmJwt(
    jarmOption,
    ephemeralPrivateJwk,
    jarmJwt
  );
  return toAuthorizationResponseTO(decryptedJwt.payload);
};
