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

import {
  PresentationSubmission,
  presentationSubmissionSchema,
} from '@vecrea/oid4vc-prex';
import { Jwt } from './types';
import { z } from 'zod';

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
 * Schema for the DirectPost data.
 * @typedef {Object} DirectPostSchema
 * @property {Object} response - The response object.
 *
 * TODO - confirm this schema is correct
 */
export const directPostSchema = z.object({
  response: z.object({
    state: z.string(),
    id_token: z.string().optional(),
    vp_token: z.string().optional(),
    presentation_submission: presentationSubmissionSchema,
    error: z.string().optional(),
    error_description: z.string().optional(),
  }),
});

/**
 * Schema for the DirectPostJwt data.
 * @typedef {Object} DirectPostJwtSchema
 * @property {string} state - The state parameter.
 * @property {string} response - The response parameter.
 */
export const directPostJwtSchema = z.object({
  state: z.string(),
  response: z.string(),
});

/**
 * Schema for the AuthorizationResponse data.
 * @typedef {Object} AuthorizationResponseSchema
 * @property {string} state - The state parameter.
 * @property {string} response - The response parameter.
 *
 */
export const authorizationResponseSchema = directPostJwtSchema;
// z.union([
//   directPostSchema,
//   directPostJwtSchema,
// ]);

/**
 * JSON representation of the DirectPost data.
 * @typedef {Object} DirectPostJSON
 * @property {Object} response - The response object.
 */
export type DirectPostJSON = z.infer<typeof directPostSchema>;

/**
 * JSON representation of the DirectPostJwt data.
 * @typedef {Object} DirectPostJwtJSON
 * @property {string} state - The state parameter.
 * @property {string} response - The response parameter.
 */
export type DirectPostJwtJSON = z.infer<typeof directPostJwtSchema>;

/**
 * JSON representation of the AuthorizationResponse data.
 * @typedef {Object} AuthorizationResponseJSON
 * @property {Object} response - The response object.
 */
export type AuthorizationResponseJSON = z.infer<
  typeof authorizationResponseSchema
>;

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

    toJSON(): DirectPostJwtJSON {
      return {
        state: this.state,
        response: this.jarm,
      };
    }

    static fromJSON(json: DirectPostJwtJSON): DirectPostJwt {
      return new DirectPostJwt(json.state, json.response);
    }
  }
}
