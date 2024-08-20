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
  ResponseModeOption,
  JarmOption,
  EphemeralECDHPrivateJwk,
  Presentation,
  EmbedOption,
  UrlBuilder,
  VerifierConfig,
} from '../../domain';
import { JwtSecuredAuthorizationRequestTO } from '../../ports/input/InitTransaction.types';
import {
  GenerateEphemeralECDHPrivateJwk,
  SignRequestObject,
} from '../../ports/out/jose';

/**
 * Creates an ephemeral ECDH private JWK based on the response mode and JARM options.
 * @param {ResponseModeOption} responseModeOption - The response mode option.
 * @param {JarmOption} jarmOption - The JARM option.
 * @param {GenerateEphemeralECDHPrivateJwk} generatePrivateJwk - The function to generate the ephemeral ECDH private JWK.
 * @returns {Promise<EphemeralECDHPrivateJwk | undefined>} A promise that resolves to the ephemeral ECDH private JWK if applicable, or undefined.
 * @throws {Error} If the JARM option is 'Signed', indicating a misconfiguration.
 */
export const createEphemeralECDHPrivateJwk = async (
  responseModeOption: ResponseModeOption,
  jarmOption: JarmOption,
  generatePrivateJwk: GenerateEphemeralECDHPrivateJwk
): Promise<EphemeralECDHPrivateJwk | undefined> => {
  if (responseModeOption !== ResponseModeOption.DirectPostJwt) {
    return undefined;
  }

  if (jarmOption.__type === 'Signed') {
    throw new Error('Misconfiguration');
  }

  const result = await generatePrivateJwk();

  return result.getOrThrow();
};

type CreateJwtSecuredAuthorizationRequestTORet = {
  requestTO: JwtSecuredAuthorizationRequestTO;
  presentation: Presentation;
};

/**
 * Creates a JWT-secured authorization request transfer object (TO) and corresponding presentation.
 * @param {Presentation.Requested} requested - The requested presentation.
 * @param {EmbedOption<RequestId>} jarOption - The JAR (JWT Authz Request) embed option.
 * @param {SignRequestObject} signRequestObject - The function to sign the request object.
 * @param {VerifierConfig} verifierConfig - The verifier configuration.
 * @param {Now} now - The function to get the current date and time.
 * @returns {Promise<CreateJwtSecuredAuthorizationRequestTORet>} A promise that resolves to an object containing the JWT-secured authorization request TO and the corresponding presentation.
 * @throws {Error} If an error occurs during the process.
 */
export const createJwtSecuredAuthorizationRequestTO = async (
  requested: Presentation.Requested,
  jarOption: EmbedOption,
  signRequestObject: SignRequestObject,
  verifierConfig: VerifierConfig,
  now: () => Date
): Promise<CreateJwtSecuredAuthorizationRequestTORet> => {
  if (jarOption.__type === 'ByValue') {
    const jwt = (
      await signRequestObject(verifierConfig, now, requested)
    ).getOrThrow();
    const requestObjectRetrieved = requested
      .retrieveRequestObject(now())
      .getOrThrow();
    const to = new JwtSecuredAuthorizationRequestTO(
      requested.id.value,
      verifierConfig.clientIdScheme.clientId,
      jwt,
      undefined
    );

    return { requestTO: to, presentation: requestObjectRetrieved };
  } else {
    const requestUri = UrlBuilder.buildUrlWithRequestId(
      jarOption.urlBuilder,
      requested.requestId
    ).href;
    const to = new JwtSecuredAuthorizationRequestTO(
      requested.id.value,
      verifierConfig.clientIdScheme.clientId,
      undefined,
      requestUri
    );

    return {
      requestTO: to,
      presentation: requested,
    };
  }
};
