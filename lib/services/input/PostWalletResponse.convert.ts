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

import {
  AuthorizationResponse,
  RequestId,
  AuthorizationResponseData,
  JarmOption,
  EphemeralECDHPrivateJwk,
} from '../../domain';
import { Result, runAsyncCatching, runCatching } from '../../kotlin';
import { VerifyJarmJwt } from '../../ports/out/jose';

/**
 * Extracts the request ID from an authorization response.
 * @param {AuthorizationResponse} response - The authorization response object.
 * @returns {Result<RequestId>} A Result object containing the extracted request ID if successful, or an error if the state is missing.
 * @throws {Error} If the state is missing from the authorization response.
 */
export const getRequestId = (
  response: AuthorizationResponse
): Result<RequestId> =>
  runCatching(() => {
    const state =
      response.__type === 'DirectPost'
        ? response.response.state
        : response.state;

    if (!state) {
      throw new Error('Missing state');
    }

    return new RequestId(state);
  });

export const toAuthorizationResponseData = (
  response: AuthorizationResponse,
  verifyJarmJwt: VerifyJarmJwt,
  jarmOption: JarmOption,
  ephemeralECDHPrivateJwk: EphemeralECDHPrivateJwk
): Promise<Result<AuthorizationResponseData>> =>
  runAsyncCatching(async () => {
    if (response.__type === 'DirectPost') {
      return response.response;
    }

    const data = (
      await verifyJarmJwt(jarmOption, ephemeralECDHPrivateJwk, response.jarm)
    ).getOrThrow();

    if (data.state != response.state) {
      throw new Error('Incorrect state');
    }

    return data;
  });
