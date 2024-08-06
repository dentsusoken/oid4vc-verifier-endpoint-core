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

import { JWTDecryptResult } from 'jose';
import { PresentationExchange } from 'oid4vc-prex';
import { AuthorizationResponseTO } from '../../../ports/out/jose';
import { Result, runAsyncCatching } from '../../../kotlin';

/**
 * Converts a decrypted JWT payload to an AuthorisationResponseTO object.
 *
 * This function takes the payload from a decrypted JWT and transforms it into
 * an AuthorisationResponseTO object. It handles the decoding of the presentation
 * submission if present in the payload.
 *
 * @param {JWTDecryptResult['payload']} payload - The payload from a decrypted JWT.
 * @returns {Promise<Result<AuthorizationResponseTO>>} A Promise that resolves to a Result
 * containing the AuthorisationResponseTO if successful, or an error if the conversion fails.
 *
 * @throws Will throw an error if the presentation submission decoding fails.
 *
 * @example
 * const jwtPayload = { ... }; // Decrypted JWT payload
 * const result = await toAuthorizationResponseTO(jwtPayload);
 * result.fold(
 *   (authResponse) => {
 *     // success
 *     console.log('Authorization Response:', authResponse);
 *   },
 *   (error) => {
 *     // failure
 *     console.error('Error converting to AuthorizationResponseTO:', error);
 *   }
 * );
 */
export const toAuthorizationResponseTO = async (
  payload: JWTDecryptResult['payload']
): Promise<Result<AuthorizationResponseTO>> =>
  runAsyncCatching(async () => {
    const to = {
      ...payload,
    } as AuthorizationResponseTO;
    if (payload.presentationSubmission) {
      const presentationSubmission = (
        await PresentationExchange.jsonParse.decodePresentationSubmission(
          payload.presentationSubmission as ReadableStream<Uint8Array> | string
        )
      ).getOrThrow();
      to.presentationSubmission = presentationSubmission;
    }

    return to;
  });
