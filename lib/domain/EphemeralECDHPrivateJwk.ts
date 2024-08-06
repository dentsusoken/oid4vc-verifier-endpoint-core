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

/**
 * Represents an ephemeral encryption private key in JWK (JSON Web Key) format.
 * This interface is used for temporary or one-time encryption purposes.
 * The key is expected to be short-lived and not stored for long-term use.
 */
export interface EphemeralECDHPrivateJwk {
  /**
   * The string representation of the ephemeral private key in JWK format.
   * This should be a valid JSON string representing a JWK for an encryption key.
   *
   * @example
   * {
   *   "kty": "EC",
   *   "crv": "P-256",
   *   "x": "MKBCTNIcKUSDii11ySs3526iDZ8AiTo7Tu6KPAqv7D4",
   *   "y": "4Etl6SRW2YiLUrN5vfvVHuhp7x8PxltmWWlbbM4IFyM",
   *   "d": "870MB6gfuTJ4HtUnUvYMyJpr5eUZNP4Bk43bVdj3eAE"
   * }
   */
  readonly value: string;
}
