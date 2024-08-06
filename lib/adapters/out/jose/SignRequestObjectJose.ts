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

import { SignJWT, JWTHeaderParameters, importJWK } from 'jose';
import { Result, runAsyncCatching } from '../../../kotlin';
import { Jwt, SigningConfig } from '../../../domain';
import { SignRequestObject } from '../../../ports/out/jose';
import { RequestObject, requestObjectFromDomain } from './RequestObject';
import {
  toClientMetaDataTO,
  toPayload,
  ClientMetaDataTO,
} from './SignRequestObjectJose.convert';

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

/**
 * Signs a request object with the provided signing configuration
 * @param {SigningConfig} signingConfig - The signing configuration
 * @param {RequestObject} requestObject - The request object to be signed
 * @param {ClientMetaDataTO} clientMetaDataTO - The client metadata transfer object
 * @returns {Promise<Result<Jwt>>} A promise that resolves to a Result containing the signed JWT
 */
const sign = async (
  signingConfig: SigningConfig,
  requestObject: RequestObject,
  clientMetaDataTO: ClientMetaDataTO
): Promise<Result<Jwt>> => {
  return runAsyncCatching(async () => {
    const { staticSigningPrivateJwk, algorithm } = signingConfig;
    const header: JWTHeaderParameters = {
      alg: algorithm,
      typ: 'oauth-authz-req+jwt',
    };
    const jwk = JSON.parse(staticSigningPrivateJwk.value);

    if (requestObject.clientIdSchemeName === 'pre-registered' && jwk.kid) {
      header.kid = jwk.kid;
    } else if (
      (requestObject.clientIdSchemeName === 'x509_san_dns' ||
        requestObject.clientIdSchemeName === 'x509_san_uri') &&
      jwk.x5c
    ) {
      header.x5c = jwk.x5c;
    }

    const payload = toPayload(requestObject, clientMetaDataTO);

    const jwt = await new SignJWT(payload)
      .setProtectedHeader(header)
      .sign(await importJWK(jwk));

    return jwt;
  });
};
