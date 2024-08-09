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
import { AuthorizationResponseData } from '../../../domain';

/**
 * Converts the payload of a decrypted JWT to an AuthorizationResponseTO object.
 * @param {JWTDecryptResult['payload']} payload - The payload of the decrypted JWT.
 * @returns {Promise<AuthorizationResponseData>} A promise that resolves to the converted AuthorizationResponseTO object.
 */
export const toAuthorizationResponseData = async (
  payload: JWTDecryptResult['payload']
): Promise<AuthorizationResponseData> => {
  const data = {
    ...payload,
  } as AuthorizationResponseData;
  if (payload.presentationSubmission) {
    const presentationSubmission = (
      await PresentationExchange.jsonParse.decodePresentationSubmission(
        payload.presentationSubmission as ReadableStream<Uint8Array> | string
      )
    ).getOrThrow();
    data.presentationSubmission = presentationSubmission;
  }

  return data;
};
