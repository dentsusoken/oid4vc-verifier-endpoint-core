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
 * Namespace containing constants for response mode options.
 *
 * These constants represent the available response modes for the authorization response.
 *
 * @namespace
 */
export namespace ResponseModeOption {
  /**
   * Represents the direct post response mode.
   * In this mode, the response is sent directly to the client via HTTP POST.
   *
   * @constant
   * @type {string}
   */
  export const DirectPost = 'direct_post';

  /**
   * Represents the direct post JWT response mode.
   * In this mode, the response is sent directly to the client via HTTP POST as a JWT.
   *
   * @constant
   * @type {string}
   */
  export const DirectPostJwt = 'direct_post.jwt';
}

/**
 * Zod schema for validating response mode options.
 *
 * This schema ensures that the response mode is one of the valid options defined in ResponseModeOption.
 * It accepts either 'direct_post' or 'direct_post.jwt'.
 *
 * @type {z.ZodUnion<[z.ZodLiteral<"direct_post">, z.ZodLiteral<"direct_post.jwt">]>}
 *
 * @example
 * // Valid usage
 * responseModeOptionSchema.parse('direct_post'); // Returns 'direct_post'
 * responseModeOptionSchema.parse('direct_post.jwt'); // Returns 'direct_post.jwt'
 *
 * // Invalid usage (will throw ZodError)
 * responseModeOptionSchema.parse('invalid'); // Throws ZodError
 *
 * @throws {z.ZodError} Throws a ZodError if the input is not a valid response mode option
 */
export const responseModeOptionSchema = z.union([
  z.literal(ResponseModeOption.DirectPost),
  z.literal(ResponseModeOption.DirectPostJwt),
]);

/**
 * Type representing the valid response mode options.
 *
 * This type is inferred from the responseModeOptionSchema and can only be one of the following string literals:
 * - 'direct_post'
 * - 'direct_post.jwt'
 *
 * @typedef {z.infer<typeof responseModeOptionSchema>} ResponseModeOption
 *
 * @example
 * const mode: ResponseModeOption = 'direct_post'; // Valid
 * const invalidMode: ResponseModeOption = 'invalid'; // TypeScript compilation error
 */
export type ResponseModeOption = z.infer<typeof responseModeOptionSchema>;
