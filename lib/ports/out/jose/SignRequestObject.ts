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

import { Jwt, Presentation, VerifierConfig } from '../../../domain';
import { Result } from '../../../kotlin';

/**
 * Interface for signing a request object.
 * @interface SignRequestObject
 * @param {VerifierConfig} verifierConfig - The verifier configuration.
 * @param {() => Date} now - A function that returns the current date and time.
 * @param {Presentation.Requested} presentation - The requested presentation.
 * @returns {Promise<Result<Jwt>>} A promise that resolves to a Result object containing the signed JWT if successful, or an error if signing fails.
 * @throws {Error} If an error occurs during the signing process.
 */
export interface SignRequestObject {
  (
    verifierConfig: VerifierConfig,
    now: () => Date,
    presentation: Presentation.Requested
  ): Promise<Result<Jwt>>;
}
