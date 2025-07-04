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
import { Result, runAsyncCatching } from '@vecrea/oid4vc-core/utils';
import { Jwt, SigningConfig } from '../../../domain';
import { RequestObject } from './RequestObject';
import { toPayload, ClientMetaDataTO } from './SignRequestObjectJose.convert';

/**
 * Signs a request object with the provided signing configuration
 * @param {SigningConfig} signingConfig - The signing configuration
 * @param {RequestObject} requestObject - The request object to be signed
 * @param {ClientMetaDataTO} clientMetaDataTO - The client metadata transfer object
 * @returns {Promise<Result<Jwt>>} A promise that resolves to a Result containing the signed JWT
 */
export const sign = async (
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
