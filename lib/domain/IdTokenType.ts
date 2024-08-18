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

import { z } from 'zod';

import { FromJSON } from '../common/json/FromJSON';

/**
 * Represents the type of an ID token.
 * @enum {string}
 */
export enum IdTokenType {
  /**
   * ID token signed by the subject (user).
   */
  SubjectSigned = 'subject_signed_id_token',

  /**
   * ID token signed by the attester (identity provider).
   */
  AttesterSigned = 'attester_signed_id_token',
}

/**
 * Zod schema for validating IdTokenType values.
 */
const schema = z.enum([IdTokenType.SubjectSigned, IdTokenType.AttesterSigned]);

export namespace IdTokenType {
  /**
   * Creates an IdTokenType value from a JSON string.
   * @type {FromJSON<IdTokenType>}
   * @param {unknown} json - The JSON string representing the IdTokenType value.
   * @returns {IdTokenType} The parsed IdTokenType value.
   * @throws {ZodError} If the JSON string is not a valid IdTokenType value.
   */
  export const fromJSON: FromJSON<IdTokenType> = (json) => schema.parse(json);

  /**
   * Converts an IdTokenType value to its JSON representation.
   * @param {IdTokenType} idTokenType - The IdTokenType value to convert.
   * @returns {string} The JSON representation of the IdTokenType value.
   */
  export const toJSON = (idTokenType: IdTokenType): string =>
    idTokenType as string;
}
