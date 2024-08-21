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
import { Jwt } from './types';

/**
 * Represents the data structure for an authorization response.
 */
export interface AuthorizationResponseData {
  /** The state parameter, typically used as a request identifier. */
  state?: string;
  /** The ID token, if present in the response. */
  idToken?: string;
  /** The Verifiable Presentation token, if present in the response. */
  vpToken?: string;
  /** The Presentation Submission object, if present in the response. */
  presentationSubmission?: PresentationSubmission;
  /** Error code, if an error occurred during the authorization process. */
  error?: string;
  /** Detailed description of the error, if an error occurred. */
  errorDescription?: string;
}

/**
 * Represents either a DirectPost or DirectPostJwt authorization response.
 */
export type AuthorizationResponse =
  | AuthorizationResponse.DirectPost
  | AuthorizationResponse.DirectPostJwt;

export namespace AuthorizationResponse {
  /**
   * AuthorizationResponse interface represents the response from an authorization endpoint.
   * It can be either a 'DirectPost' or 'DirectPostJwt' response type.
   *
   * @interface AuthorizationResponse
   * @property {('DirectPost' | 'DirectPostJwt')} __type - The type of the authorization response.
   * It can be one of the following values:
   * - 'DirectPost': Indicates that the response is a direct POST response.
   * - 'DirectPostJwt': Indicates that the response is a direct POST response with a JWT (JSON Web Token).
   */
  interface AuthorizationResponse {
    __type: 'DirectPost' | 'DirectPostJwt';
  }
  /**
   * Represents a direct post authorization response.
   */
  export class DirectPost implements AuthorizationResponse {
    /** Discriminator for the DirectPost type. */
    readonly __type = 'DirectPost' as const;

    /**
     * Creates a new DirectPost instance.
     * @param response - The authorization response data.
     */
    constructor(public readonly response: AuthorizationResponseData) {}
  }

  /**
   * Represents a direct post JWT authorization response.
   */
  export class DirectPostJwt implements AuthorizationResponse {
    /** Discriminator for the DirectPostJwt type. */
    readonly __type = 'DirectPostJwt' as const;

    /**
     * Creates a new DirectPostJwt instance.
     * @param state - The state parameter.
     * @param jarm - The JWT Authorization Response Mode (JARM) token.
     */
    constructor(public readonly state: string, public readonly jarm: Jwt) {}
  }
}
