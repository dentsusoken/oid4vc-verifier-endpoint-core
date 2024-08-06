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
 * Represents a JSON Web Token (JWT) as a string.
 */
export type Jwt = string;

/**
 * Enum representing the response mode options for authorization responses.
 */
export enum ResponseModeOption {
  /**
   * Direct POST response mode.
   * The authorization response is sent as a direct POST request to the client.
   */
  DirectPost,

  /**
   * Direct POST JWT response mode.
   * The authorization response is sent as a JWT in a direct POST request to the client.
   */
  DirectPostJwt,
}

/**
 * Enum representing the types of ID tokens.
 */
export enum IdTokenType {
  /**
   * ID token signed by the subject (user).
   */
  SubjectSigned,

  /**
   * ID token signed by the attester (identity provider).
   */
  AttesterSigned,
}
