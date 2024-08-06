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
 * Represents a static signing private key in JWK (JSON Web Key) format.
 * This interface is used for long-term or permanent digital signature purposes.
 * Unlike ephemeral keys, static keys are intended for repeated use over an extended period.
 */
export interface StaticSigningPrivateJwk {
  /**
   * The string representation of the static private signing key in JWK format.
   * This should be a valid JSON string representing a JWK for a signing key.
   *
   * @example
   * {
   *   "kty": "EC",
   *   "crv": "P-256",
   *   "x": "f83OJ3D2xF1Bg8vub9tLe1gHMzV76e8Tus9uPHvRVEU",
   *   "y": "x_FEzRu9m36HLN_tue659LNpXW6pCyStikYjKIWI5a0",
   *   "d": "jpsQnnGQmL-YBIffH1136cspYG6-0iY7X1fCE9-E9LI"
   * }
   */
  readonly value: string;
}
