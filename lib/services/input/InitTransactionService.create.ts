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
  RequestId,
  VerifierConfig,
} from '../../domain';
import { JwtSecuredAuthorizationRequestTO } from '../../ports/input/InitTransaction.types';
import { Now } from '../../ports/out/cfg';
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

export const createJwtSecuredAuthorizationRequestTO = async (
  requested: Presentation.Requested,
  jarOption: EmbedOption<RequestId>,
  signRequestObject: SignRequestObject,
  verifierConfig: VerifierConfig,
  now: Now
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
    const requestUri = jarOption.buildUrl(requested.requestId).href;
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
