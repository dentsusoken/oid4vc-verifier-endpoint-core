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
import { StaticSigningPrivateJwk } from '../../../domain';

/**
 * Represents a function that parses a static signing private key in JWK format.
 *
 * @interface ParseStaticSigningPrivateJwk
 * @function
 * @async
 *
 * @param {string} jwkString - The JWK string representing the static signing private key.
 *
 * @returns {Promise<Result<StaticSigningPrivateJwk>>} A promise that resolves to a Result object containing the parsed StaticSigningPrivateJwk if successful, or an error if parsing fails.
 */
export interface ParseStaticSigningPrivateJwk {
  (jwkString: string): Promise<Result<StaticSigningPrivateJwk>>;
}
