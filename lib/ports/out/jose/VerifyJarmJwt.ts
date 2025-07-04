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

import {
  EphemeralECDHPrivateJwk,
  JarmOption,
  Jwt,
  AuthorizationResponseData,
} from '../../../domain';
import { Result } from '@vecrea/oid4vc-core/utils';

/**
 * Verifies a JARM (JWT Authorization Response Mode) JWT and returns the decoded AuthorizationResponseTO.
 * @param {JarmOption} jarmOption - The JARM option specifying the algorithms and encryption methods.
 * @param {EphemeralECDHPrivateJwk | undefined} ephemeralECDHPrivateJwk - The ephemeral ECDH private JWK, if available.
 * @param {Jwt} jarmJwt - The JARM JWT to be verified.
 * @returns {Promise<Result<AuthorizationResponseTO>>} A promise that resolves to a Result containing the decoded AuthorizationResponseTO if successful, or an error if verification fails.
 */
export interface VerifyJarmJwt {
  (
    jarmOption: JarmOption,
    ephemeralECDHPrivateJwk: EphemeralECDHPrivateJwk | undefined,
    jarmJwt: Jwt
  ): Promise<Result<AuthorizationResponseData>>;
}
