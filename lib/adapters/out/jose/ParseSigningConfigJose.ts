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
import { ParseSigningConfig } from '../../../ports/out/jose';
import { SigningConfig, StaticSigningPrivateJwk } from '../../../domain';
import { guessAlgorithmFromJWK } from '../../../utils';

/**
 * Creates a function that parses and validates a signing configuration.
 *
 * @function
 * @returns {ParseSigningConfig} A function that asynchronously parses and validates a SigningConfig.
 */
export const createParseSigningConfigJoseInvoker = (): ParseSigningConfig =>
  invoke;

/**
 * Asynchronously parses and validates a signing configuration.
 *
 * This function attempts to import the provided JWK and algorithm using the 'jose' library.
 * If successful, it returns a SigningConfig object. If an error occurs during the process,
 * it will be caught and returned as part of the Result object from runAsyncCatching.
 *
 * @function
 * @async
 * @param {string} privateJwk - The private JSON Web Key as a JSON string.
 * @param {string} algorithm - The algorithm to be used for signing.
 * @returns {Promise<Result<SigningConfig>>} A Promise that resolves to a Result object
 * containing either the validated SigningConfig or an Error if validation fails.
 */
const invoke: ParseSigningConfig = (privateJwk, algorithm) =>
  runAsyncCatching(async () => {
    const jwk = JSON.parse(privateJwk);
    const alg = guessAlgorithmFromJWK(jwk);
    if (alg && alg !== algorithm) {
      throw new Error(`algorithm from JWK: ${alg}, specified: ${algorithm}`);
    }
    await importJWK(jwk, algorithm);
    const staticSigningPrivateJwk: StaticSigningPrivateJwk = {
      value: privateJwk,
    };
    const signingConfig: SigningConfig = {
      staticSigningPrivateJwk,
      algorithm,
    };

    return signingConfig;
  });
