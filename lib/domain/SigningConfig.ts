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

import { StaticSigningPrivateJwk } from './';

/**
 * Configuration for signing operations.
 * This interface defines the necessary parameters for performing digital signatures.
 */
export interface SigningConfig {
  /**
   * The static private signing key in JWK (JSON Web Key) format.
   * This key is used for creating digital signatures and is intended for long-term use.
   *
   * @see StaticSigningPrivateJwk for more details on the key format.
   */
  readonly staticSigningPrivateJwk: StaticSigningPrivateJwk;

  /**
   * The algorithm used for signing.
   * This should be a valid JWS (JSON Web Signature) algorithm name.
   *
   * @example
   * Common values include:
   * - "ES256" for ECDSA using P-256 curve and SHA-256 hash algorithm
   */
  readonly algorithm: string;
}
