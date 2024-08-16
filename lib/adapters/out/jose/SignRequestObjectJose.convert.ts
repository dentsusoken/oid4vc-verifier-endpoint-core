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

import { PresentationDefinition } from 'oid4vc-prex';
import {
  ClientMetaData,
  EphemeralECDHPrivateJwk,
  RequestId,
  EmbedOption,
} from '../../../domain';
import { RequestObject } from './RequestObject';

/**
 * Represents the payload structure for the request object
 */
type Payload = {
  iss: string;
  aud: string[];
  response_type: string;
  response_mode: string;
  client_id: string;
  scope: string;
  state: string;
  nonce: string;
  client_id_scheme: string;
  iat: number;
  id_token_type?: string;
  presentation_definition?: Record<string, unknown>;
  presentation_definition_uri?: string;
  client_metadata?: ClientMetaDataTO;
  response_uri?: string;
};

/**
 * Represents the structure of JSON Web Key Set
 */
type Jwks = {
  keys: [Record<string, unknown>];
};

/**
 * Represents the client metadata transfer object
 */
export type ClientMetaDataTO = {
  id_token_signed_response_alg: string | undefined;
  id_token_encrypted_response_alg: string | undefined;
  id_token_encrypted_response_enc: string | undefined;
  subject_syntax_types_supported: string[];
  jwks?: Jwks;
  jwks_uri?: string;
  authorization_signed_response_alg?: string;
  authorization_encrypted_response_alg?: string;
  authorization_encrypted_response_enc?: string;
};

/**
 * Retrieves the JSON Web Key Set based on the embed option and private JWK
 * @param {EmbedOption} jwkOption - The embed option for JWK
 * @param {EphemeralECDHPrivateJwk | undefined} privateJwk - The private JWK
 * @returns {Jwks | undefined} The JWKS or undefined
 */
export const getJwks = (
  jwkOption: EmbedOption,
  privateJwk: EphemeralECDHPrivateJwk | undefined
): Jwks | undefined => {
  if (jwkOption.__type === 'ByValue' && privateJwk) {
    const jwk = JSON.parse(privateJwk.value);
    delete jwk.d;
    // delete jwk.use;

    return {
      keys: [jwk],
    };
  }

  return undefined;
};

/**
 * Retrieves the JWKS URI based on the embed option and request ID
 * @param {EmbedOption<RequestId>} jwkOption - The embed option for JWK
 * @param {RequestId} requestId - The request ID
 * @returns {string | undefined} The JWKS URI or undefined
 */
export const getJwksUri = (
  jwkOption: EmbedOption<RequestId>,
  requestId: RequestId
): string | undefined => {
  if (jwkOption.__type === 'ByReference') {
    return jwkOption.buildUrl(requestId).href;
  }

  return undefined;
};

/**
 * Converts client metadata to a transfer object
 * @param {RequestId} requestId - The request ID
 * @param {ClientMetaData} c - The client metadata
 * @param {string} responseMode - The response mode
 * @param {EphemeralECDHPrivateJwk | undefined} privateJWK - The private JWK
 * @returns {ClientMetaDataTO} The client metadata transfer object
 */
export const toClientMetaDataTO = (
  requestId: RequestId,
  c: ClientMetaData,
  responseMode: string,
  privateJWK: EphemeralECDHPrivateJwk | undefined
): ClientMetaDataTO => {
  const jwks = getJwks(c.jwkOption, privateJWK);
  const jwksUri = getJwksUri(c.jwkOption, requestId);

  const clientMetadata: ClientMetaDataTO = {
    id_token_signed_response_alg: c.idTokenSignedResponseAlg,
    id_token_encrypted_response_alg: c.idTokenEncryptedResponseAlg,
    id_token_encrypted_response_enc: c.idTokenEncryptedResponseEnc,
    subject_syntax_types_supported: c.subjectSyntaxTypesSupported,
  };

  if (jwks) {
    clientMetadata.jwks = jwks;
  }

  if (jwksUri) {
    clientMetadata.jwks_uri = jwksUri;
  }

  if (responseMode === 'direct_post.jwt') {
    clientMetadata.authorization_signed_response_alg = c.jarmOption.jwsAlg();
    clientMetadata.authorization_encrypted_response_alg = c.jarmOption.jweAlg();
    clientMetadata.authorization_encrypted_response_enc = c.jarmOption.jweEnc();
  }

  return clientMetadata;
};

/**
 * Converts request object and client metadata to a payload
 * @param {RequestObject} requestObject - The request object
 * @param {ClientMetaDataTO} clientMetaData - The client metadata transfer object
 * @returns {Payload} The payload object
 */
export const toPayload = (
  requestObject: RequestObject,
  clientMetaData: ClientMetaDataTO
): Payload => {
  const payload: Payload = {
    iss: requestObject.clientId,
    aud: requestObject.aud,
    response_type: requestObject.responseType.join(' '),
    response_mode: requestObject.responseMode,
    client_id: requestObject.clientId,
    scope: requestObject.scope.join(' '),
    state: requestObject.state,
    nonce: requestObject.nonce,
    client_id_scheme: requestObject.clientIdSchemeName,
    iat: Math.floor(requestObject.issuedAt.getTime() / 1000),
  };

  if (requestObject.idTokenType?.length > 0) {
    payload.id_token_type = requestObject.idTokenType.join(' ');
  }

  if (
    requestObject.presentationDefinition &&
    requestObject.presentationDefinition instanceof PresentationDefinition
  ) {
    payload.presentation_definition =
      requestObject.presentationDefinition.serialize();
  }

  if (requestObject.presentationDefinitionUri) {
    payload.presentation_definition_uri =
      requestObject.presentationDefinitionUri.href;
  }

  if (clientMetaData) {
    payload.client_metadata = clientMetaData;
  }

  if (requestObject.responseUri) {
    payload.response_uri = requestObject.responseUri.toString();
  }

  return payload;
};
