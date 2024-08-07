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
import { Jwt } from '../../../domain';
import { SignRequestObject } from '../../../ports/out/jose';
import { requestObjectFromDomain } from './RequestObject';
import { toClientMetaDataTO } from './SignRequestObjectJose.convert';
import { sign } from './SignRequestObjectJose.sign';

/**
 * Creates a SignRequestObject function using the Jose library.
 * @returns {SignRequestObject} A function that signs request objects.
 */
export const createSignRequestObjectJoseInvoker = (): SignRequestObject =>
  invoke;

/**
 * Signs a request object and returns a JWT
 * @param {VerifierConfig} verifierConfig - The verifier configuration
 * @param {Date} at - The current date and time
 * @param {Presentation} presentation - The presentation object
 * @returns {Promise<Result<Jwt>>} A promise that resolves to a Result containing the signed JWT
 */
const invoke: SignRequestObject = async (
  verifierConfig,
  at,
  presentation
): Promise<Result<Jwt>> => {
  const requestObject = requestObjectFromDomain(
    verifierConfig,
    at,
    presentation
  );
  const clientMetaDataTO = toClientMetaDataTO(
    presentation.requestId,
    verifierConfig.clientMetaData,
    requestObject.responseMode,
    presentation.ephemeralECDHPrivateJwk
  );

  return sign(
    verifierConfig.clientIdScheme.jarSigning,
    requestObject,
    clientMetaDataTO
  );
};
