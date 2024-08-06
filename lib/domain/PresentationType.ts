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
 * Represents a type of presentation in the authentication process.
 */
export interface PresentationType {}

/**
 * Namespace containing implementations and type guards for various PresentationType.
 */
export namespace PresentationTypeNS {
  /**
   * Represents a request for an ID token.
   */
  export class IdTokenRequest implements PresentationType {
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

  /**
   * Type guard to check if a PresentationType is an IdTokenRequest.
   * @param type - The PresentationType to check.
   * @returns True if the type is an IdTokenRequest, false otherwise.
   */
  export function isIdTokenRequest(
    type: PresentationType
  ): type is IdTokenRequest {
    return type.constructor === IdTokenRequest;
  }

  /**
   * Type guard to check if a PresentationType is a VpTokenRequest.
   * @param type - The PresentationType to check.
   * @returns True if the type is a VpTokenRequest, false otherwise.
   */
  export function isVpTokenRequest(
    type: PresentationType
  ): type is VpTokenRequest {
    return type.constructor === VpTokenRequest;
  }

  /**
   * Type guard to check if a PresentationType is an IdAndVpTokenRequest.
   * @param type - The PresentationType to check.
   * @returns True if the type is an IdAndVpTokenRequest, false otherwise.
   */
  export function isIdAndVpTokenRequest(
    type: PresentationType
  ): type is IdAndVpTokenRequest {
    return type.constructor === IdAndVpTokenRequest;
  }
}
