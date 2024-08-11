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
import 'reflect-metadata';
import { PresentationDefinition } from 'oid4vc-prex';
import { Expose, Type } from 'class-transformer';

/**
 * Enumeration of presentation types for the transaction.
 * @enum {string}
 */
export enum PresentationTypeTO {
  IdTokenRequest = 'id_token',
  VpTokenRequest = 'vp_token',
  IdAndVpTokenRequest = 'vp_token id_token',
}

/**
 * Enumeration of ID token types for the transaction.
 * @enum {string}
 */
export enum IdTokenTypeTO {
  SubjectSigned = 'subject_signed_id_token',
  AttesterSigned = 'attester_signed_id_token',
}

/**
 * Enumeration of response modes for the transaction.
 * @enum {string}
 */
export enum ResponseModeTO {
  DirectPost = 'direct_post',
  DirectPostJwt = 'direct_post.jwt',
}

/**
 * Enumeration of embed modes for the transaction.
 * @enum {string}
 */
export enum EmbedModeTO {
  ByValue = 'by_value',
  ByReference = 'by_reference',
}

/**
 * Represents the initialization transaction transfer object.
 */
export class InitTransactionTO {
  /**
   * The presentation type.
   * @type {PresentationTypeTO}
   * @default PresentationTypeTO.IdAndVpTokenRequest
   */
  @Expose({ name: 'type' })
  type: PresentationTypeTO = PresentationTypeTO.IdAndVpTokenRequest;

  /**
   * The ID token type.
   * @type {IdTokenTypeTO}
   * @optional
   */
  @Expose({ name: 'id_token_type' })
  idTokenType?: IdTokenTypeTO;

  /**
   * The presentation definition.
   * @type {PresentationDefinition}
   * @optional
   */
  @Expose({ name: 'presentation_definition' })
  @Type(() => PresentationDefinition)
  presentationDefinition?: PresentationDefinition;

  /**
   * The nonce value.
   * @type {string}
   * @optional
   */
  @Expose({ name: 'nonce' })
  nonce?: string;

  /**
   * The response mode.
   * @type {ResponseModeTO}
   * @optional
   */
  @Expose({ name: 'response_mode' })
  responseMode?: ResponseModeTO;

  /**
   * The JAR (JWT Authz Request) embed mode.
   * @type {EmbedModeTO}
   * @optional
   */
  @Expose({ name: 'jar_mode' })
  jarMode?: EmbedModeTO;

  /**
   * The presentation definition embed mode.
   * @type {EmbedModeTO}
   * @optional
   */
  @Expose({ name: 'presentation_definition_mode' })
  presentationDefinitionMode?: EmbedModeTO;

  /**
   * The redirect URI template.
   * @type {string}
   * @optional
   */
  @Expose({ name: 'wallet_response_redirect_uri_template' })
  redirectUriTemplate?: string;

  /**
   * Creates an instance of InitTransactionTO.
   * @param {PresentationTypeTO} [type=PresentationTypeTO.IdAndVpTokenRequest] The presentation type.
   * @param {IdTokenTypeTO} [idTokenType] The ID token type.
   * @param {PresentationDefinition} [presentationDefinition] The presentation definition.
   * @param {string} [nonce] The nonce value.
   * @param {ResponseModeTO} [responseMode] The response mode.
   * @param {EmbedModeTO} [jarMode] The JAR (JWT Authz Request) embed mode.
   * @param {EmbedModeTO} [presentationDefinitionMode] The presentation definition embed mode.
   * @param {string} [redirectUriTemplate] The redirect URI template.
   */
  constructor(
    type: PresentationTypeTO = PresentationTypeTO.IdAndVpTokenRequest,
    idTokenType?: IdTokenTypeTO,
    presentationDefinition?: PresentationDefinition,
    nonce?: string,
    responseMode?: ResponseModeTO,
    jarMode?: EmbedModeTO,
    presentationDefinitionMode?: EmbedModeTO,
    redirectUriTemplate?: string
  ) {
    this.type = type;
    this.idTokenType = idTokenType;
    this.presentationDefinition = presentationDefinition;
    this.nonce = nonce;
    this.responseMode = responseMode;
    this.jarMode = jarMode;
    this.presentationDefinitionMode = presentationDefinitionMode;
    this.redirectUriTemplate = redirectUriTemplate;
  }
}

/**
 * Represents a JWT secured authorization request transfer object.
 */
export class JwtSecuredAuthorizationRequestTO {
  /**
   * The transaction ID.
   */
  @Expose({ name: 'presentation_id' })
  transactionId?: string;

  /**
   * The client ID.
   */
  @Expose({ name: 'client_id' })
  clientId?: string;

  /**
   * The request.
   */
  @Expose()
  request?: string;

  /**
   * The request URI.
   * @type {string}
   */
  @Expose({ name: 'request_uri' })
  requestUri?: string;

  /**
   * Creates an instance of JwtSecuredAuthorizationRequestTO.
   * @param {string} transactionId - The transaction ID.
   * @param {string} clientId - The client ID.
   * @param {string} [request] - The request.
   * @param {string} requestUri - The request URI.
   */
  constructor();
  constructor(
    transactionId: string,
    clientId: string,
    request?: string,
    requestUri?: string
  );
  constructor(
    transactionId?: string,
    clientId?: string,
    request?: string,
    requestUri?: string
  ) {
    this.transactionId = transactionId;
    this.clientId = clientId;
    this.request = request;
    this.requestUri = requestUri;
  }
}
