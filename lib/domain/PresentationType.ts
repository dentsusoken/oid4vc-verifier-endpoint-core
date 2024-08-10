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
import { IdTokenType } from '.';

/**
 * Represents the type of presentation request.
 * @typedef {PresentationType.IdTokenRequest | PresentationType.VpTokenRequest | PresentationType.IdAndVpTokenRequest} PresentationType
 */
export type PresentationType =
  | PresentationType.IdTokenRequest
  | PresentationType.VpTokenRequest
  | PresentationType.IdAndVpTokenRequest;

/**
 * Namespace containing implementations and type guards for various PresentationType.
 */
export namespace PresentationType {
  interface PresentationType {
    readonly __type:
      | 'IdTokenRequest'
      | 'VpTokenRequest'
      | 'IdAndVpTokenRequest';
  }

  /**
   * Represents a request for an ID token.
   */
  export class IdTokenRequest implements PresentationType {
    readonly __type = 'IdTokenRequest' as const;
    /**
     * Creates an instance of IdTokenRequest.
     * @param idTokenType - An array of ID token types.
     */
    constructor(public idTokenType: IdTokenType[]) {}
  }

  /**
   * Represents a request for a VP token.
   */
  export class VpTokenRequest implements PresentationType {
    readonly __type = 'VpTokenRequest' as const;

    /**
     * Creates an instance of VpTokenRequest.
     * @param presentationDefinition - The presentation definition for the VP token.
     */
    constructor(public presentationDefinition: PresentationDefinition) {}
  }

  /**
   * Represents a request for both an ID token and a VP token.
   */
  export class IdAndVpTokenRequest implements PresentationType {
    readonly __type = 'IdAndVpTokenRequest' as const;

    /**
     * Creates an instance of IdAndVpTokenRequest.
     * @param idTokenType - An array of ID token types.
     * @param presentationDefinition - The presentation definition for the VP token.
     */
    constructor(
      public idTokenType: IdTokenType[],
      public presentationDefinition: PresentationDefinition
    ) {}
  }
}
