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

import { EphemeralECDHPrivateJwk, JarmOptionNS, Jwt } from '../../../domain';
import { Result } from '../../../kotlin';
import { PresentationSubmission } from 'oid4vc-prex';

/**
 * Represent the Authorization Response placed by wallet
 */
export interface AuthorizationResponseTO {
  state?: string; // this is the request_id
  idToken?: string;
  vpToken?: string;
  presentationSubmission?: PresentationSubmission;
  error?: string;
  errorDescription?: string;
}

/**
 * Verifies a JARM (JWT Secured Authorization Response Mode) JWT.
 *
 * @interface VerifyJarmJwt
 * @function
 * @param {JarmOption} jarmOption - The JARM option configuration.
 * @param {EphemeralECDHPrivateJwk | null} ephemeralEcPrivateKey - The ephemeral EC private key used for encryption, if applicable.
 * @param {Jwt} jarmJwt - The JARM JWT to be verified.
 * @returns {Result<AuthorizationResponseTO>} A Result containing the AuthorizationResponseTO if verification is successful, or an error if verification fails.
 */
export interface VerifyJarmJwt {
  (
    jarmOption: JarmOption,
    ephemeralPrivateJwk: EphemeralECDHPrivateJwk | null,
    jarmJwt: Jwt
  ): Promise<Result<AuthorizationResponseTO>>;
}
