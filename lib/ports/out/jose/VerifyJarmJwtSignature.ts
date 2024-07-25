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
  EphemeralEncryptionKeyPairJWK,
  JarmOption,
  Jwt,
} from '../../../domain';
import { AuthorisationResponseTO } from '../../../../mock/prex';
import { Result } from '../../../kotlin';

export interface VerifyJarmJwtSignature {
  (
    jarmOption: JarmOption,
    ephemeralEcPrivateKey: EphemeralEncryptionKeyPairJWK | null,
    jarmJwt: Jwt
  ): Result<AuthorisationResponseTO>;
}
