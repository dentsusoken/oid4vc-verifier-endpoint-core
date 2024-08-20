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
import { VerifierConfig, Presentation, UrlBuilder } from '../../../domain';
import {
  getScope,
  getIdTokenType,
  getResponseType,
  getAud,
  getClientIdSchemeName,
  getPresentationDefinition,
  getPresentationDefinitionUri,
  getResponseMode,
} from './RequestObject.convert';
import type { ClientIdSchemeName } from './RequestObject.convert';

/**
 * Represents a request object for presentation exchange.
 */
export interface RequestObject {
  /** The client ID */
  clientId: string;
  /** The client ID scheme name*/
  clientIdSchemeName: ClientIdSchemeName;
  /** Array of response types */
  responseType: string[];
  /** URI of the presentation definition, if applicable */
  presentationDefinitionUri: URL | undefined;
  /** The presentation definition, if applicable */
  presentationDefinition: PresentationDefinition | undefined;
  /** Array of scopes */
  scope: string[];
  /** Array of ID token types */
  idTokenType: string[];
  /** Nonce value */
  nonce: string;
  /** Response mode */
  responseMode: string;
  /** Response URI, if applicable */
  responseUri: URL | undefined;
  /** Array of audience values */
  aud: string[];
  /** State value */
  state: string;
  /** Issuance date and time */
  issuedAt: Date;
}

/**
 * Creates a RequestObject from domain entities.
 *
 * @param verifierConfig - The verifier configuration
 * @param at - The current date and time
 * @param presentation - The requested presentation
 * @returns A RequestObject constructed from the provided parameters
 */
export const requestObjectFromDomain = (
  verifierConfig: VerifierConfig,
  now: () => Date,
  presentation: Presentation.Requested
): RequestObject => {
  const type = presentation.type;
  const scope = getScope(type);
  const idTokenType = getIdTokenType(type);
  const responseType = getResponseType(type);
  const aud = getAud(type);
  const clientIdSchemeName = getClientIdSchemeName(
    verifierConfig.clientIdScheme
  );
  const presentationDefinition = getPresentationDefinition(
    presentation.presentationDefinitionMode,
    type
  );
  const presentationDefinitionUri = getPresentationDefinitionUri(
    presentation.presentationDefinitionMode,
    presentation.requestId
  );
  const responseMode = getResponseMode(presentation.responseMode);

  const requestObject: RequestObject = {
    clientId: verifierConfig.clientIdScheme.clientId,
    clientIdSchemeName,
    scope,
    idTokenType,
    presentationDefinitionUri,
    presentationDefinition,
    responseType,
    aud,
    nonce: presentation.nonce.value,
    state: presentation.requestId.value,
    responseMode,
    responseUri: UrlBuilder.buildUrlWithRequestId(
      verifierConfig.responseUrlBuilder,
      presentation.requestId
    ),
    issuedAt: now(),
  };

  return requestObject;
};
