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

import { PresentationDefinition } from '@vecrea/oid4vc-prex';
import {
  EmbedOption,
  GetWalletResponseMethod,
  IdTokenType,
  Nonce,
  PresentationType,
  ResponseCode,
  ResponseModeOption,
} from '../../domain';
import {
  EmbedModeTO,
  IdTokenTypeTO,
  PresentationTypeTO,
  ResponseModeTO,
} from '../../ports/input/InitTransaction.types';
import { CreateQueryWalletResponseRedirectUri } from '../../ports/out/cfg';

/**
 * Converts an IdTokenTypeTO value to an array of IdTokenType values.
 * @param {IdTokenTypeTO} [to] - The IdTokenTypeTO value to convert.
 * @returns {IdTokenType[]} An array containing the corresponding IdTokenType value.
 * If the input is undefined or null, an empty array is returned.
 */
export const toIdTokenTypes = (to?: IdTokenTypeTO): IdTokenType[] => {
  if (!to) {
    return [];
  }

  return [
    to === IdTokenTypeTO.SubjectSigned
      ? IdTokenType.SubjectSigned
      : IdTokenType.AttesterSigned,
  ];
};

/**
 * Converts a string value to a Nonce instance.
 * @param {string} [to] - The string value to convert to a Nonce.
 * @returns {Nonce} The Nonce instance created from the provided string value.
 * @throws {Error} If the 'to' parameter is not provided or is an empty string.
 */
export const toNonce = (to?: string): Nonce => {
  if (!to) {
    throw new Error('Missing nonce');
  }

  return new Nonce(to);
};

/**
 * Converts a PresentationTypeTO value to a PresentationType instance.
 * @param {PresentationTypeTO} [to] - The PresentationTypeTO value to convert.
 * @param {IdTokenType[]} [idTokenTypes=[]] - The array of IdTokenType values for IdTokenRequest and IdAndVpTokenRequest.
 * @param {PresentationDefinition} [pd] - The PresentationDefinition for VpTokenRequest and IdAndVpTokenRequest.
 * @returns {PresentationType} The corresponding PresentationType instance.
 * @throws {Error} If the 'to' parameter is not provided.
 * @throws {Error} If the 'pd' parameter is not provided for VpTokenRequest and IdAndVpTokenRequest.
 */
export const toPresentationType = (
  to?: PresentationTypeTO,
  idTokenTypes: IdTokenType[] = [],
  pd?: PresentationDefinition
): PresentationType => {
  if (!to) {
    throw new Error('Missing presentation type');
  }

  if (to === PresentationTypeTO.IdTokenRequest) {
    return new PresentationType.IdTokenRequest(idTokenTypes);
  } else if (to === PresentationTypeTO.VpTokenRequest) {
    if (!pd) {
      throw new Error('Missing presentation definition');
    }

    return new PresentationType.VpTokenRequest(pd);
  } else {
    if (!pd) {
      throw new Error('Missing presentation definition');
    }

    return new PresentationType.IdAndVpTokenRequest(idTokenTypes, pd);
  }
};

/**
 * Converts an EmbedModeTO value to an EmbedOption instance.
 * @param {EmbedModeTO | undefined} to - The EmbedModeTO value to convert.
 * @param {EmbedOption.ByReference} byReference - The EmbedOption.ByReference instance to use when 'to' is EmbedModeTO.ByReference.
 * @param {EmbedOption} defaultOption - The default EmbedOption to use when 'to' is undefined.
 * @returns {EmbedOption} The corresponding EmbedOption instance.
 */
export const toEmbedOption = (
  to: EmbedModeTO | undefined,
  byReference: EmbedOption.ByReference,
  defaultOption: EmbedOption
): EmbedOption => {
  if (!to) {
    return defaultOption;
  }

  if (to === EmbedModeTO.ByValue) {
    return EmbedOption.ByValue.INSTANCE;
  }

  return byReference;
};

/**
 * Converts a ResponseModeTO value to a ResponseModeOption.
 * @param {ResponseModeTO | undefined} to - The ResponseModeTO value to convert.
 * @param {ResponseModeOption} defaultOption - The default ResponseModeOption to use when 'to' is undefined.
 * @returns {ResponseModeOption} The corresponding ResponseModeOption.
 */
export const toResponseModeOption = (
  to: ResponseModeTO | undefined,
  defaultOption: ResponseModeOption
): ResponseModeOption => {
  if (!to) {
    return defaultOption;
  }

  if (to === ResponseModeTO.DirectPost) {
    return ResponseModeOption.DirectPost;
  }

  return ResponseModeOption.DirectPostJwt;
};

/**
 * Converts a redirect URI template to a GetWalletResponseMethod.
 * @param {string | undefined} redirectUriTemplate - The redirect URI template.
 * @param {CreateQueryWalletResponseRedirectUri} createRedirectUri - The function to create a redirect URI.
 * @returns {GetWalletResponseMethod} The GetWalletResponseMethod instance.
 * @throws {Error} If the createRedirectUri function returns a failure result.
 */
export const toGetWalletResponseMethod = (
  redirectUriTemplate: string | undefined,
  createRedirectUri: CreateQueryWalletResponseRedirectUri
): GetWalletResponseMethod => {
  if (!redirectUriTemplate) {
    return GetWalletResponseMethod.Poll.INSTANCE;
  }

  const result = createRedirectUri(
    redirectUriTemplate,
    new ResponseCode('test')
  );

  if (result.isFailure()) {
    throw new Error('Invalid wallet response template');
  }

  return new GetWalletResponseMethod.Redirect(redirectUriTemplate);
};
