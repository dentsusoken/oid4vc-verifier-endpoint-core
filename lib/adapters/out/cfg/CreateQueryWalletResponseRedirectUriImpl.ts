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

import { CreateQueryWalletResponseRedirectUri } from '../../../ports/out/cfg';
import { runCatching, assert } from '../../../kotlin';

/**
 * The placeholder string used for the response code
 */
export const RESPONSE_CODE_PLACE_HOLDER = '{RESPONSE_CODE}';

/**
 * Creates a function to generate a query wallet response redirect URI
 * @returns {CreateQueryWalletResponseRedirectUri} A function that creates a wallet response redirect URI
 */
export const createCreateQueryWalletResponseRedirectUri =
  (): CreateQueryWalletResponseRedirectUri => invoke;

/**
 * Creates a wallet response redirect URI from a template and response code
 * @param {string} template - The template for the redirect URI
 * @param {ResponseCode} responseCode - The response code
 * @returns {Result<URL>} A Result object containing the created URL
 * @throws {Error} If the template does not contain the response code placeholder
 * @throws {TypeError} If an invalid URL is generated
 */
const invoke: CreateQueryWalletResponseRedirectUri = (template, responseCode) =>
  runCatching(() => {
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
