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
  PresentationType,
  WalletResponse,
  ResponseModeOption,
} from '../../domain';
import { VerifyJarmJwt } from '../../ports/out/jose';

/**
 * Extracts the request ID from an authorization response.
 * @param {AuthorizationResponse} response - The authorization response object.
 * @returns {RequestId} The extracted request ID.
 * @throws {Error} If the state is missing from the authorization response.
 */
export const getRequestId = (response: AuthorizationResponse): RequestId => {
  const state =
    response.__type === 'DirectPost' ? response.response.state : response.state;

  if (!state) {
    throw new Error('Missing state');
  }

  return new RequestId(state);
};

/**
 * Converts an AuthorizationResponse to AuthorizationResponseData.
 * @param {AuthorizationResponse} response - The authorization response object.
 * @param {VerifyJarmJwt} verifyJarmJwt - Function to verify the JARM JWT.
 * @param {JarmOption} jarmOption - The JARM option used for verification.
 * @param {EphemeralECDHPrivateJwk | undefined} ephemeralECDHPrivateJwk - The ephemeral ECDH private key in JWK format, or undefined if not available.
 * @returns {Promise<AuthorizationResponseData>} A promise that resolves to the AuthorizationResponseData.
 * @throws {Error} If the state in the verified data does not match the state in the response.
 */
export const toAuthorizationResponseData = async (
  response: AuthorizationResponse,
  verifyJarmJwt: VerifyJarmJwt,
  jarmOption: JarmOption,
  ephemeralECDHPrivateJwk: EphemeralECDHPrivateJwk | undefined
): Promise<AuthorizationResponseData> => {
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
};

/**
 * Converts AuthorizationResponseData to WalletResponse based on the presentation type.
 * @param {AuthorizationResponseData} authzData - The authorization response data.
 * @param {PresentationType} presentationType - The presentation type.
 * @returns {WalletResponse} The corresponding WalletResponse instance.
 * @throws {Error} If required properties are missing based on the presentation type.
 */
export const toWalletResponse = (
  authzData: AuthorizationResponseData,
  presentationType: PresentationType
): WalletResponse => {
  if (authzData.error) {
    return new WalletResponse.WalletResponseError(
      authzData.error,
      authzData.errorDescription
    );
  }

  switch (presentationType.__type) {
    case 'IdTokenRequest':
      if (!authzData.idToken) {
        throw new Error('Missing idToken');
      }

      return new WalletResponse.IdToken(authzData.idToken);
    case 'VpTokenRequest':
      if (!authzData.vpToken) {
        throw new Error('Missing vpToken');
      }

      if (!authzData.presentationSubmission) {
        throw new Error('Missing presentation submission');
      }

      return new WalletResponse.VpToken(
        authzData.vpToken,
        authzData.presentationSubmission
      );
    case 'IdAndVpTokenRequest':
      if (!authzData.idToken) {
        throw new Error('Missing idToken');
      }

      if (!authzData.vpToken) {
        throw new Error('Missing vpToken');
      }

      if (!authzData.presentationSubmission) {
        throw new Error('Missing presentation submission');
      }

      return new WalletResponse.IdAndVpToken(
        authzData.idToken,
        authzData.vpToken,
        authzData.presentationSubmission
      );
  }
};

export const getReponseModeOption = (
  response: AuthorizationResponse
): ResponseModeOption => {
  return response.__type === 'DirectPost'
    ? ResponseModeOption.DirectPost
    : ResponseModeOption.DirectPostJwt;
};
