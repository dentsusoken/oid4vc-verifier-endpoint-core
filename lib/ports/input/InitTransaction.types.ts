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
import { PresentationDefinition, presentationDefinitionSchema } from 'oid4vc-prex';
import { z } from 'zod';
import { FromJSON } from '../../common/json/FromJSON';

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

export const initTransactionSchema = z
  .object({
    type: z.enum([PresentationTypeTO.IdTokenRequest, PresentationTypeTO.VpTokenRequest, PresentationTypeTO.IdAndVpTokenRequest]).default(PresentationTypeTO.IdAndVpTokenRequest),
    id_token_type: z.enum([IdTokenTypeTO.SubjectSigned, IdTokenTypeTO.AttesterSigned]).optional(),
    presentation_definition: presentationDefinitionSchema.optional(),
    nonce: z.string().optional(),
    response_mode: z.enum([ResponseModeTO.DirectPost, ResponseModeTO.DirectPostJwt]).optional(),
    jar_mode: z.enum([EmbedModeTO.ByValue, EmbedModeTO.ByReference]).optional(),
    presentation_definition_mode: z.enum([EmbedModeTO.ByValue, EmbedModeTO.ByReference]).optional(),
    wallet_response_redirect_uri_template: z.string().optional()
  });

export type InitTransactionJSON = z.infer<
  typeof initTransactionSchema
>;

export class InitTransactionTO {
  type: PresentationTypeTO = PresentationTypeTO.IdAndVpTokenRequest;
  idTokenType?: IdTokenTypeTO;
  presentationDefinition?: PresentationDefinition;
  nonce?: string;
  responseMode?: ResponseModeTO;
  jarMode?: EmbedModeTO;
  presentationDefinitionMode?: EmbedModeTO;
  redirectUriTemplate?: string;

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

  toJSON(): InitTransactionJSON {
    return {
      type: this.type,
      id_token_type: this.idTokenType,
      presentation_definition: this.presentationDefinition?.toJSON(),
      nonce: this.nonce,
      response_mode: this.responseMode,
      jar_mode: this.jarMode,
      presentation_definition_mode: this.presentationDefinitionMode,
      wallet_response_redirect_uri_template: this.redirectUriTemplate
    };
  }

  static fromJSON: FromJSON<InitTransactionJSON, InitTransactionTO> = (json) => {
    return new InitTransactionTO(
      json.type,
      json.id_token_type,
      PresentationDefinition.fromJSON(
        json.presentation_definition
      ),
      json.nonce,
      json.response_mode,
      json.jar_mode,
      json.presentation_definition_mode,
      json.wallet_response_redirect_uri_template
    );
  };
}

export const jwtSecuredAuthorizationRequestSchema = z
  .object({
    presentation_id: z.string().optional(),
    client_id: z.string().optional(),
    request: z.string().optional(),
    request_uri: z.string().optional()
  });

export type JwtSecuredAuthorizationRequestJSON = z.infer<
  typeof jwtSecuredAuthorizationRequestSchema
>;

export class JwtSecuredAuthorizationRequestTO {
  transactionId?: string;
  clientId?: string;
  request?: string;
  requestUri?: string;

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

  toJSON(): JwtSecuredAuthorizationRequestJSON {
    return {
      presentation_id: this.transactionId,
      client_id: this.clientId,
      request: this.request,
      request_uri: this.requestUri
    };
  }

  static fromJSON: FromJSON<JwtSecuredAuthorizationRequestJSON, JwtSecuredAuthorizationRequestTO> = (json) => {
    return new JwtSecuredAuthorizationRequestTO(
      json.presentation_id || "",
      json.client_id || "",
      json.request,
      json.request_uri
    );
  }
}
