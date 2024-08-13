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

import { GetWalletResponseMethod, ResponseCode } from '../../domain';
import {
  CreateQueryWalletResponseRedirectUri,
  GenerateResponseCode,
} from '../../ports/out/cfg';
import { WalletResponseAcceptedTO } from '../../ports/input';

/**
 * Creates a response code based on the wallet response method.
 * @param {GetWalletResponseMethod} getWalletResponseMethod - The method to get the wallet response.
 * @param {GenerateResponseCode} generateResponseCode - The function to generate a response code.
 * @returns {Promise<ResponseCode | undefined>} A promise that resolves to the generated response code if the wallet response method is 'Redirect', or undefined otherwise.
 */
export const createResponseCode = async (
  getWalletResponseMethod: GetWalletResponseMethod,
  generateResponseCode: GenerateResponseCode
): Promise<ResponseCode | undefined> => {
  if (getWalletResponseMethod.__type === 'Redirect') {
    return generateResponseCode();
  }

  return undefined;
};

export const createWalletResponseAcceptedTO = async (
  getWalletResponseMethod: GetWalletResponseMethod,
  createQueryWalletResponseRedirectUri: CreateQueryWalletResponseRedirectUri,
  responseCode: ResponseCode | undefined
): Promise<WalletResponseAcceptedTO | undefined> => {
  if (getWalletResponseMethod.__type === 'Redirect') {
    if (!responseCode) {
      throw new Error('Not found response code');
    }

    const redirectUri = createQueryWalletResponseRedirectUri(
      getWalletResponseMethod.redirectUriTemplate,
      responseCode
    ).getOrThrow().href;

    return new WalletResponseAcceptedTO(redirectUri);
  }

  return undefined;
};
