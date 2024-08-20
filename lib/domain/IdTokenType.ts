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

/**
 * Namespace containing constants for IdTokenType values.
 * @namespace
 */
export namespace IdTokenType {
  /**
   * Represents an ID token signed by the subject (user).
   * @constant
   * @type {string}
   */
  export const SubjectSigned = 'subject_signed_id_token';

  /**
   * Represents an ID token signed by the attester (identity provider).
   * @constant
   * @type {string}
   */
  export const AttesterSigned = 'attester_signed_id_token';
}

/**
 * Zod schema for validating IdTokenType values.
 * This schema ensures that only valid IdTokenType values are accepted.
 *
 * @constant
 * @type {z.ZodUnion<[z.ZodLiteral<"subject_signed_id_token">, z.ZodLiteral<"attester_signed_id_token">]>}
 */
export const idTokenTypeSchema = z.union([
  z.literal(IdTokenType.SubjectSigned),
  z.literal(IdTokenType.AttesterSigned),
]);

/**
 * Represents the type of an ID token.
 * This type is inferred from the idTokenTypeSchema and can only be one of the valid IdTokenType values.
 *
 * @typedef {z.infer<typeof idTokenTypeSchema>} IdTokenType
 */
export type IdTokenType = z.infer<typeof idTokenTypeSchema>;
