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
 * Represents a response from a wallet in the authentication process.
 */
export interface WalletResponse {}

/**
 * Namespace containing implementations and type guards for various WalletResponse types.
 */
export namespace WalletResponseNS {
  /**
   * Represents a wallet response containing an ID token.
   */
  export class IdToken implements WalletResponse {
    /**
     * Creates an instance of IdToken.
     * @param idToken - The JWT representing the ID token.
     * @throws {WalletResponseError} If idToken is not provided.
     */
    constructor(public idToken: Jwt) {
      if (!idToken) {
        throw new Error('idToken is required');
      }
    }
  }

  /**
   * Represents a wallet response containing a VP token and presentation submission.
   */
  export class VpToken implements WalletResponse {
    /**
     * Creates an instance of VpToken.
     * @param vpToken - The VP token string.
     * @param presentationSubmission - The presentation submission associated with the VP token.
     * @throws {WalletResponseError} If vpToken is not provided.
     */
    constructor(
      public vpToken: string,
      public presentationSubmission: PresentationSubmission
    ) {
      if (!vpToken) {
        throw new Error('vpToken is required');
      }
    }
  }

  /**
   * Represents a wallet response containing both an ID token and a VP token.
   */
  export class IdAndVpToken implements WalletResponse {
    /**
     * Creates an instance of IdAndVpToken.
     * @param idToken - The ID token string.
     * @param vpToken - The VP token string.
     * @param presentationSubmission - The presentation submission associated with the VP token.
     * @throws {WalletResponseError} If either idToken or vpToken is not provided.
     */
    constructor(
      public idToken: string,
      public vpToken: string,
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
   * Represents an error response from the wallet.
   */
  export class WalletResponseError implements WalletResponse {
    /**
     * Creates an instance of Error.
     * @param value - The error value or code.
     * @param description - Optional description of the error.
     */
    constructor(public value: string, public description?: string) {}
  }

  /**
   * Checks if a WalletResponse is an instance of IdToken.
   * @param response - The WalletResponse to check.
   * @returns True if the response is an instance of IdToken, false otherwise.
   */
  export function isIdToken(response: WalletResponse): response is IdToken {
    return response.constructor === IdToken;
  }

  /**
   * Checks if a WalletResponse is an instance of VpToken.
   * @param response - The WalletResponse to check.
   * @returns True if the response is an instance of VpToken, false otherwise.
   */
  export function isVpToken(response: WalletResponse): response is VpToken {
    return response.constructor === VpToken;
  }

  /**
   * Checks if a WalletResponse is an instance of IdAndVpToken.
   * @param response - The WalletResponse to check.
   * @returns True if the response is an instance of IdAndVpToken, false otherwise.
   */
  export function isIdAndVpToken(
    response: WalletResponse
  ): response is IdAndVpToken {
    return response.constructor === IdAndVpToken;
  }

  /**
   * Checks if a WalletResponse is an instance of WalletResponseError.
   * @param response - The WalletResponse to check.
   * @returns True if the response is an instance of WalletResponseError, false otherwise.
   */
  export function isWalletResponseError(
    response: WalletResponse
  ): response is WalletResponseError {
    return response.constructor === WalletResponseError;
  }
}
