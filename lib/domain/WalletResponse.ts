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

import { PresentationSubmission } from 'oid4vc-prex';
import { Jwt } from '.';

/**
 * Represents the response from a wallet.
 * @typedef {IdToken | VpToken | IdAndVpToken | WalletResponseError} WalletResponse
 */
export type WalletResponse =
  | WalletResponse.IdToken
  | WalletResponse.VpToken
  | WalletResponse.IdAndVpToken
  | WalletResponse.WalletResponseError;

export namespace WalletResponse {
  /**
   * Interface for wallet response types.
   * @interface WalletResponse
   * @property {string} __type - The type of the wallet response.
   */
  interface WalletResponse {
    readonly __type:
      | 'IdToken'
      | 'VpToken'
      | 'IdAndVpToken'
      | 'WalletResponseError';
  }

  /**
   * Represents an ID token wallet response.
   * @class IdToken
   * @implements {WalletResponse}
   * @property {string} __type - The type of the wallet response.
   * @property {Jwt} idToken - The ID token.
   */
  export class IdToken implements WalletResponse {
    readonly __type = 'IdToken';

    /**
     * Creates an instance of IdToken.
     * @constructor
     * @param {Jwt} idToken - The ID token.
     * @throws {Error} If the ID token is not provided.
     */
    constructor(public idToken: Jwt) {
      if (!idToken) {
        throw new Error('idToken is required');
      }
    }
  }

  /**
   * Represents a VP token wallet response.
   * @class VpToken
   * @implements {WalletResponse}
   * @property {string} __type - The type of the wallet response.
   * @property {Jwt} vpToken - The VP token.
   * @property {PresentationSubmission} presentationSubmission - The presentation submission.
   */
  export class VpToken implements WalletResponse {
    readonly __type = 'VpToken';

    /**
     * Creates an instance of VpToken.
     * @constructor
     * @param {Jwt} vpToken - The VP token.
     * @param {PresentationSubmission} presentationSubmission - The presentation submission.
     * @throws {Error} If the VP token is not provided.
     */
    constructor(
      public vpToken: Jwt,
      public presentationSubmission: PresentationSubmission
    ) {
      if (!vpToken) {
        throw new Error('vpToken is required');
      }
    }
  }

  /**
   * Represents an ID and VP token wallet response.
   * @class IdAndVpToken
   * @implements {WalletResponse}
   * @property {string} __type - The type of the wallet response.
   * @property {Jwt} idToken - The ID token.
   * @property {Jwt} vpToken - The VP token.
   * @property {PresentationSubmission} presentationSubmission - The presentation submission.
   */
  export class IdAndVpToken implements WalletResponse {
    readonly __type = 'IdAndVpToken';

    /**
     * Creates an instance of IdAndVpToken.
     * @constructor
     * @param {Jwt} idToken - The ID token.
     * @param {Jwt} vpToken - The VP token.
     * @param {PresentationSubmission} presentationSubmission - The presentation submission.
     * @throws {Error} If the ID token or VP token is not provided.
     */
    constructor(
      public idToken: Jwt,
      public vpToken: Jwt,
      public presentationSubmission: PresentationSubmission
    ) {
      if (!idToken) {
        throw new Error('idToken is required');
      }
      if (!vpToken) {
        throw new Error('vpToken is required');
      }
    }
  }

  /**
   * Represents a wallet response error.
   * @class WalletResponseError
   * @implements {WalletResponse}
   * @property {string} __type - The type of the wallet response.
   * @property {string} value - The error value.
   * @property {string} [description] - The optional error description.
   */
  export class WalletResponseError implements WalletResponse {
    readonly __type = 'WalletResponseError';

    /**
     * Creates an instance of WalletResponseError.
     * @constructor
     * @param {string} value - The error value.
     * @param {string} [description] - The optional error description.
     */
    constructor(public value: string, public description?: string) {}
  }
}
