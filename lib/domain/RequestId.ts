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
 * Zod schema for validating request IDs.
 *
 * This schema ensures that a request ID is a non-empty string.
 * It applies the following validations:
 * - The value must be a string.
 * - The string must have a minimum length of 1 character.
 *
 * @type {z.ZodString}
 *
 * @example
 * // Valid usage
 * requestIdScheme.parse('req-123'); // Returns 'req-123'
 * requestIdScheme.parse('a'); // Returns 'a'
 *
 * // Invalid usage (will throw ZodError)
 * requestIdScheme.parse(''); // Throws error: String must contain at least 1 character(s)
 * requestIdScheme.parse(123); // Throws error: Expected string, received number
 *
 * @throws {z.ZodError} Throws a ZodError if the input fails validation
 */
export const requestIdScheme = z.string().min(1);

/**
 * Represents a request ID.
 */
export class RequestId {
  /**
   * Creates an instance of RequestId.
   * @param {string} value - The value of the request ID.
   * @throws {Error} If the value is falsy (empty, null, undefined, etc.).
   */
  constructor(public value: string) {
    if (!value) {
      throw new Error('value is required');
    }
  }

  /**
   * Returns the JSON representation of the RequestId.
   * @returns {string} The JSON representation of the RequestId.
   */
  toJSON(): string {
    return this.value;
  }
}
