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

import { importJWK } from 'jose';
import { runAsyncCatching } from '../../../kotlin';
import { ParseStaticSigningPrivateJwk } from '../../../ports/out/jose';
import { StaticSigningPrivateJwk } from '../../../domain';

/**
 * Creates a function that parses a static signing private key in JWK format using the JOSE library.
 *
 * @function createParseStaticSigningPrivateJwkJoseInvoker
 *
 * @returns {ParseStaticSigningPrivateJwk} A function that parses a static signing private key in JWK format.
 */
export const createParseStaticSigningPrivateJwkJoseInvoker =
  (): ParseStaticSigningPrivateJwk => invoke;

/**
 * Parses a static signing private key in JWK format using the JOSE library.
 *
 * @function invoke
 * @async
 *
 * @param {string} jwkString - The JWK string representing the static signing private key.
 *
 * @returns {Promise<Result<StaticSigningPrivateJwk>>} A promise that resolves to a Result object containing the parsed StaticSigningPrivateJwk if successful, or an error if parsing fails.
 *
 * @throws {Error} If the JWK string is invalid or the JOSE library fails to import the JWK.
 */
const invoke: ParseStaticSigningPrivateJwk = (jwkString) =>
  runAsyncCatching(async () => {
    const jwk = JSON.parse(jwkString);
    await importJWK(jwk);
    const staticSigningPrivateJwk: StaticSigningPrivateJwk = {
      value: jwkString,
    };

    return staticSigningPrivateJwk;
  });
