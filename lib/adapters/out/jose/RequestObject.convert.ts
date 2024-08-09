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
  PresentationTypeNS,
  IdTokenType,
  EmbedOption,
  EmbedOptionNS,
  ResponseModeOption,
  PresentationType,
  RequestId,
  ClientIdScheme,
  ClientIdScheme,
} from '../../../domain';

/**
 * Get the scope based on the presentation type
 * @param {PresentationType} type - The presentation type
 * @returns {string[]} An array of scopes
 */
export const getScope = (type: PresentationType): string[] => {
  return PresentationTypeNS.isIdTokenRequest(type) ||
    PresentationTypeNS.isIdAndVpTokenRequest(type)
    ? ['openid']
    : [];
};

/**
 * Get the ID token type based on the presentation type
 * @param {PresentationType} type - The presentation type
 * @returns {string[]} An array of ID token types
 */
export const getIdTokenType = (type: PresentationType): string[] => {
  return (
    PresentationTypeNS.isIdTokenRequest(type) ||
    PresentationTypeNS.isIdAndVpTokenRequest(type)
      ? type.idTokenType
      : []
  ).map((it) =>
    it === IdTokenType.AttesterSigned
      ? 'attester_signed_id_token'
      : 'subject_signed_id_token'
  );
};

/**
 * Get the response type based on the presentation type
 * @param {PresentationType} type - The presentation type
 * @returns {string[]} An array of response types
 */
export const getResponseType = (type: PresentationType): string[] => {
  if (PresentationTypeNS.isIdTokenRequest(type)) {
    return ['id_token'];
  } else if (PresentationTypeNS.isVpTokenRequest(type)) {
    return ['vp_token'];
  } else return ['vp_token', 'id_token'];
};

/**
 * Get the audience based on the presentation type
 * @param {PresentationType} type - The presentation type
 * @returns {string[]} An array of audiences
 */
export const getAud = (type: PresentationType): string[] => {
  if (PresentationTypeNS.isIdTokenRequest(type)) {
    return [];
  }
  return ['https://self-issued.me/v2'];
};

export type ClientIdSchemeName =
  | 'pre-registered'
  | 'x509_san_dns'
  | 'x509_san_uri';

/**
 * Converts a ClientIdScheme to its string representation.
 *
 * @param {ClientIdScheme} clientIdScheme - The ClientIdScheme to convert.
 * @returns {string} The string representation of the ClientIdScheme:
 *   - 'pre-registered' for PreRegistered scheme
 *   - 'x509_san_dns' for X509SanDns scheme
 *   - 'x509_san_uri' for X509SanUri scheme
 */
export const getClientIdSchemeName = (
  clientIdScheme: ClientIdScheme
): ClientIdSchemeName => {
  if (clientIdScheme.__type === 'PreRegistered') {
    return 'pre-registered';
  } else if (clientIdScheme.__type === 'X509SanDns') {
    return 'x509_san_dns';
  } else {
    return 'x509_san_uri';
  }
};

/**
 * Get the presentation definition based on the embed option and presentation type
 * @param {EmbedOption | undefined} presentationDefinitionMode - The embed option for the presentation definition
 * @param {PresentationType} type - The presentation type
 * @returns {PresentationDefinition | undefined} The presentation definition or undefined
 */
export const getPresentationDefinition = (
  presentationDefinitionMode: EmbedOption | undefined,
  type: PresentationType
): PresentationDefinition | undefined => {
  if (!presentationDefinitionMode) {
    return undefined;
  }
  return EmbedOptionNS.isByValue(presentationDefinitionMode) &&
    (PresentationTypeNS.isVpTokenRequest(type) ||
      PresentationTypeNS.isIdAndVpTokenRequest(type))
    ? type.presentationDefinition
    : undefined;
};

/**
 * Get the presentation definition URI based on the embed option and request ID
 * @param {EmbedOption<RequestId> | undefined} presentationDefinitionMode - The embed option for the presentation definition
 * @param {RequestId} requestId - The request ID
 * @returns {URL | undefined} The presentation definition URI or undefined
 */
export const getPresentationDefinitionUri = (
  presentationDefinitionMode: EmbedOption<RequestId> | undefined,
  requestId: RequestId
): URL | undefined => {
  if (!presentationDefinitionMode) {
    return undefined;
  }
  return EmbedOptionNS.isByReference(presentationDefinitionMode)
    ? presentationDefinitionMode.buildUrl(requestId)
    : undefined;
};

/**
 * Get the response mode string based on the ResponseModeOption
 * @param {ResponseModeOption} mode - The response mode option
 * @returns {string} The response mode string
 */
export const getResponseMode = (mode: ResponseModeOption): string =>
  mode === ResponseModeOption.DirectPost ? 'direct_post' : 'direct_post.jwt';
