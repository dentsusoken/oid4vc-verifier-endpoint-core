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
 * Represents an ephemeral ECDH private key in JWK format.
 *
 * @interface EphemeralECDHPrivateJwk
 * @property {string} value - The value of the ephemeral ECDH private key.
 * @readonly
 *
 * @example
 * const privateKey: EphemeralECDHPrivateJwk = {
 *   value: 'abc123...'
 * };
 */
export interface EphemeralECDHPrivateJwk {
  readonly value: string;
}
