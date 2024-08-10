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
 * Represents the method to get the wallet response.
 * @typedef {GetWalletResponseMethod.Poll | GetWalletResponseMethod.Redirect} GetWalletResponseMethod
 */
export type GetWalletResponseMethod =
  | GetWalletResponseMethod.Poll
  | GetWalletResponseMethod.Redirect;

/**
 * Namespace for GetWalletResponseMethod related classes and functions.
 * @namespace GetWalletResponseMethod
 */
export namespace GetWalletResponseMethod {
  /**
   * Interface representing a GetWalletResponseMethod.
   * @interface GetWalletResponseMethod
   */
  interface GetWalletResponseMethod {
    /**
     * The type of the GetWalletResponseMethod.
     * @type {('Poll' | 'Redirect')}
     * @readonly
     */
    readonly __type: 'Poll' | 'Redirect';
  }

  /**
   * Represents a polling method to get the wallet response.
   * @class Poll
   * @implements {GetWalletResponseMethod}
   */
  export class Poll implements GetWalletResponseMethod {
    /**
     * The singleton instance of the Poll class.
     * @type {Poll}
     * @static
     * @readonly
     */
    static readonly INSTANCE = new Poll();

    /**
     * The type of the GetWalletResponseMethod.
     * @type {('Poll')}
     * @readonly
     */
    readonly __type = 'Poll';

    /**
     * Private constructor to enforce singleton pattern.
     * @private
     */
    private constructor() {}
  }

  /**
   * Represents a redirect method to get the wallet response.
   * @class Redirect
   * @implements {GetWalletResponseMethod}
   */
  export class Redirect implements GetWalletResponseMethod {
    /**
     * The type of the GetWalletResponseMethod.
     * @type {('Redirect')}
     * @readonly
     */
    readonly __type = 'Redirect';

    /**
     * Creates an instance of Redirect.
     * @param {string} redirectUriTemplate - The redirect URI template.
     */
    constructor(public redirectUriTemplate: string) {}
  }
}
