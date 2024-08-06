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

/**
 * Represents a method for getting the wallet response.
 *
 * @interface GetWalletResponseMethod
 */
export interface GetWalletResponseMethod {}

export namespace GetWalletResponseMethodNS {
  /**
   * Represents the poll method for getting the wallet response.
   *
   * @class Poll
   * @implements {GetWalletResponseMethod}
   */
  export class Poll implements GetWalletResponseMethod {}

  /**
   * Represents the redirect method for getting the wallet response.
   *
   * @class Redirect
   * @implements {GetWalletResponseMethod}
   *
   * @param {string} redirectUriTemplate - The template for the redirect URI.
   */
  export class Redirect implements GetWalletResponseMethod {
    constructor(public redirectUriTemplate: string) {}
  }

  /**
   * Checks if the given method is an instance of the Poll class.
   *
   * @function isPoll
   *
   * @param {GetWalletResponseMethod} method - The method to check.
   *
   * @returns {boolean} True if the method is an instance of Poll, false otherwise.
   */
  export function isPoll(method: GetWalletResponseMethod): method is Poll {
    return method.constructor === Poll;
  }

  /**
   * Checks if the given method is an instance of the Redirect class.
   *
   * @function isRedirect
   *
   * @param {GetWalletResponseMethod} method - The method to check.
   *
   * @returns {boolean} True if the method is an instance of Redirect, false otherwise.
   */
  export function isRedirect(
    method: GetWalletResponseMethod
  ): method is Redirect {
    return method.constructor === Redirect;
  }
}
