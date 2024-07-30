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

import { PresentationDefinition } from '../../../../mock/prex';
import {
  ClientIdScheme,
  VerifierConfig,
  Presentation,
  PresentationType,
  IdTokenType,
  EmbedOption,
  ResponseModeOption,
} from '../../../domain';

export interface RequestObject {
  clientIdScheme: ClientIdScheme;
  responseType: string[];
  presentationDefinitionUri: URL | undefined;
  presentationDefinition: PresentationDefinition | undefined;
  scope: string[];
  idTokenType: string[];
  nonce: string;
  responseMode: string;
  responseUri: URL | undefined;
  aud: string[];
  state: string;
  issuedAt: Date;
}

export function requestObjectFromDomain(
  verifierConfig: VerifierConfig,
  clock: { now: () => Date },
  presentation: Presentation.Requested
): RequestObject {
  const type = presentation.type;
  const scope =
    type instanceof PresentationType.IdTokenRequest ||
    type instanceof PresentationType.IdAndVpToken
      ? ['openid']
      : [];

  const idTokenType = (
    type instanceof PresentationType.IdTokenRequest ||
    type instanceof PresentationType.IdAndVpToken
      ? type.idTokenType
      : []
  ).map((it) =>
    it === IdTokenType.AttesterSigned
      ? 'attester_signed_id_token'
      : 'subject_signed_id_token'
  );

  const maybePresentationDefinition = type.presentationDefinitionOrNull();
  const presentationDefinitionUri = maybePresentationDefinition
    ? presentation.presentationDefinitionMode instanceof EmbedOption.ByReference
      ? presentation.presentationDefinitionMode.buildUrl(presentation.requestId)
      : null
    : null;

  const presentationDefinition =
    maybePresentationDefinition &&
    presentation.presentationDefinitionMode instanceof EmbedOption.ByValue
      ? maybePresentationDefinition
      : null;

  const responseType =
    type instanceof PresentationType.IdTokenRequest
      ? ['id_token']
      : type instanceof PresentationType.VpTokenRequest
      ? ['vp_token']
      : ['vp_token', 'id_token'];

  const aud =
    type instanceof PresentationType.IdTokenRequest
      ? []
      : ['https://self-issued.me/v2'];

  const requestObject: RequestObject = {
    clientIdScheme: verifierConfig.clientIdScheme,
    scope,
    idTokenType,
    presentationDefinitionUri,
    presentationDefinition,
    responseType,
    aud,
    nonce: presentation.nonce.value,
    state: presentation.requestId.value,
    responseMode:
      presentation.responseMode === ResponseModeOption.DirectPost
        ? 'direct_post'
        : 'direct_post.jwt',
    responseUri: verifierConfig.responseUriBuilder(presentation.requestId),
    issuedAt: clock.now(),
  };

  return requestObject;
}
