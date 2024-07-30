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

import { SignJWT, JWTHeaderParameters } from 'jose';
import { Result, runAsyncCatching } from '../../../kotlin';
import {
  ClientMetaData,
  EphemeralEncryptionKeyPairJWK,
  RequestId,
  ClientIdScheme,
  Jwt,
  EmbedOption,
} from '../../../domain';
import { SignRequestObject } from '../../../ports/out/jose';
import { RequestObject, requestObjectFromDomain } from './RequestObject';
import { PresentationDefinition } from '../../../../mock/prex';

type Payload = {
  iss: string;
  aud: string[];
  response_type: string;
  client_id: string;
  scope: string;
  state: string;
  nonce: string;
  client_id_scheme: string;
  iat: number;
  id_token_type?: string;
  presentation_definition?: PresentationDefinition;
  presentation_definition_uri?: string;
  client_metadata?: ClientMetaData4Payload;
  response_uri?: string;
};

type ClientMetaData4Payload = {
  id_token_signed_response_alg: string;
  id_token_encrypted_response_alg: string;
  id_token_encrypted_response_enc: string;
  subject_syntax_types_supported: string[];
  jwks?: { keys: Record<string, unknown>[] };
  jwks_uri?: string;
  authorization_signed_response_alg?: string;
  authorization_encrypted_response_alg?: string;
  authorization_encrypted_response_enc?: string;
};

/**
 * Creates a SignRequestObject function using the Jose library.
 * @returns {SignRequestObject} A function that signs request objects.
 */
export const createSignRequestObjectJoseInvoker =
  (): SignRequestObject => (verifierConfig, clock, presentation) =>
    invoke(verifierConfig, clock, presentation);

/**
 * Signs a request object using the provided configuration and presentation data.
 * @param {VerifierConfig} verifierConfig - The verifier configuration.
 * @param {{ now: () => Date }} clock - An object with a now method that returns the current date.
 * @param {Presentation.Requested} presentation - The presentation data.
 * @returns {Promise<Result<Jwt>>} A promise that resolves to a Result containing the signed JWT.
 */
export const invoke: SignRequestObject = async (
  verifierConfig,
  clock,
  presentation
): Promise<Result<Jwt>> => {
  const requestObject = requestObjectFromDomain(
    verifierConfig,
    clock,
    presentation
  );
  const { ephemeralEcPrivateKey } = presentation;
  return sign(
    presentation.requestId,
    verifierConfig.clientMetaData,
    ephemeralEcPrivateKey,
    requestObject
  );
};

/**
 * Signs a request object and creates a JWT.
 * @param {RequestId} requestId - The request ID.
 * @param {ClientMetaData} clientMetaData - The client metadata.
 * @param {EphemeralEncryptionKeyPairJWK | undefined} ecKeyPairJWK - The ephemeral encryption key pair JWK.
 * @param {RequestObject} requestObject - The request object to be signed.
 * @returns {Promise<Result<Jwt>>} A promise that resolves to a Result containing the signed JWT.
 */
export const sign = async (
  requestId: RequestId,
  clientMetaData: ClientMetaData,
  ecKeyPairJWK: EphemeralEncryptionKeyPairJWK | undefined,
  requestObject: RequestObject
): Promise<Result<Jwt>> => {
  return runAsyncCatching(async () => {
    const { key, algorithm } = requestObject.clientIdScheme.jarSigning;
    const header: JWTHeaderParameters = {
      alg: algorithm,
      typ: 'oauth-authz-req+jwt',
    };
    const jwk = JSON.parse(key);

    if (requestObject.clientIdScheme instanceof ClientIdScheme.PreRegistered) {
      header.kid = jwk.kid;
    } else if (
      requestObject.clientIdScheme instanceof ClientIdScheme.X509SanDns ||
      requestObject.clientIdScheme instanceof ClientIdScheme.X509SanUri
    ) {
      header.x5c = jwk.x5c;
    }

    const clientMetaData4Payload = toClientMetaData4Payload(
      requestId,
      clientMetaData,
      requestObject.responseMode,
      ecKeyPairJWK
    );
    const payload = toPayload(clientMetaData4Payload, requestObject);

    const jwt = await new SignJWT(payload).setProtectedHeader(header).sign(jwk);

    return jwt;
  });
};

/**
 * Converts client metadata and request object to a payload for JWT.
 * @param {ClientMetaData4Payload} clientMetaData - The client metadata for the payload.
 * @param {RequestObject} r - The request object.
 * @returns {Payload} The payload for the JWT.
 */
export const toPayload = (
  clientMetaData: ClientMetaData4Payload,
  r: RequestObject
): Payload => {
  const payload: Payload = {
    iss: r.clientIdScheme.clientId,
    aud: r.aud,
    response_type: r.responseType.join(' '),
    client_id: r.clientIdScheme.clientId,
    scope: r.scope.join(' '),
    state: r.state,
    nonce: r.nonce,
    client_id_scheme: r.clientIdScheme.name,
    iat: Math.floor(r.issuedAt.getTime() / 1000),
  };

  if (r.idTokenType?.length > 0) {
    payload.id_token_type = r.idTokenType.join(' ');
  }

  if (r.presentationDefinition) {
    payload.presentation_definition = r.presentationDefinition;
  }

  if (r.presentationDefinitionUri) {
    payload.presentation_definition_uri =
      r.presentationDefinitionUri.toString();
  }

  if (clientMetaData) {
    payload.client_metadata = clientMetaData;
  }

  if (r.responseUri) {
    payload.response_uri = r.responseUri.toString();
  }

  return payload;
};

/**
 * Converts client metadata to a format suitable for the JWT payload.
 * @param {RequestId} requestId - The request ID.
 * @param {ClientMetaData} c - The client metadata.
 * @param {string} responseMode - The response mode.
 * @param {EphemeralEncryptionKeyPairJWK | undefined} ecKeyPairJWK - The ephemeral encryption key pair JWK.
 * @returns {ClientMetaData4Payload} The client metadata formatted for the payload.
 */
export const toClientMetaData4Payload = (
  requestId: RequestId,
  c: ClientMetaData,
  responseMode: string,
  ecKeyPairJWK: EphemeralEncryptionKeyPairJWK | undefined
): ClientMetaData4Payload => {
  let jwkSet: { keys: Record<string, unknown>[] } | undefined;
  let jwkSetUri: URL | undefined;

  if (ecKeyPairJWK) {
    if (c.jwkOption instanceof EmbedOption.ByValue) {
      const jwk = JSON.parse(ecKeyPairJWK.value);
      delete jwk.d;
      jwkSet = { keys: [jwk] };
    } else if (c.jwkOption instanceof EmbedOption.ByReference) {
      jwkSetUri = c.jwkOption.buildUrl(requestId);
    }
  }

  const clientMetadata: ClientMetaData4Payload = {
    id_token_signed_response_alg: c.idTokenSignedResponseAlg,
    id_token_encrypted_response_alg: c.idTokenEncryptedResponseAlg,
    id_token_encrypted_response_enc: c.idTokenEncryptedResponseEnc,
    subject_syntax_types_supported: c.subjectSyntaxTypesSupported,
  };

  if (jwkSet) {
    clientMetadata.jwks = jwkSet;
  }

  if (jwkSetUri) {
    clientMetadata.jwks_uri = jwkSetUri.toString();
  }

  if (responseMode === 'direct_post.jwt') {
    clientMetadata.authorization_signed_response_alg = c.jarmOption.jwsAlg();
    clientMetadata.authorization_encrypted_response_alg = c.jarmOption.jweAlg();
    clientMetadata.authorization_encrypted_response_enc =
      c.jarmOption.encryptionMethod();
  }

  return clientMetadata;
};
