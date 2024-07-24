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
import { Result, runCatching, assert } from '../../../kotlin';
import { ResponseCode, GetWalletResponseMethod } from '../../../domain';

interface CreateQueryWalletResponseRedirectUri {
  redirectUri(template: string, responseCode: ResponseCode): Result<URL>;
}

export namespace CreateQueryWalletResponseRedirectUri {
  export const RESPONSE_CODE_PLACE_HOLDER = '{RESPONSE_CODE}';

  export const Simple: CreateQueryWalletResponseRedirectUri = {
    redirectUri(template: string, responseCode: ResponseCode): Result<URL> {
      return runCatching(() => {
        assert(
          template.includes(RESPONSE_CODE_PLACE_HOLDER),
          'Expected response_code place holder not found in template'
        );
        const url = template.replace(
          RESPONSE_CODE_PLACE_HOLDER,
          responseCode.value
        );
        return new URL(url);
      });
    },
  };
}

export const redirectUri = (
  redirect: GetWalletResponseMethod.Redirect,
  responseCode: ResponseCode
): URL => {
  return CreateQueryWalletResponseRedirectUri.Simple.redirectUri(
    redirect.redirectUriTemplate,
    responseCode
  ).getOrThrow();
};

export const isValidTemplate = (template: string): boolean => {
  return CreateQueryWalletResponseRedirectUri.Simple.redirectUri(
    template,
    new ResponseCode('test')
  ).isSuccess;
};
