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
 * Zod schema for validating nonce values.
 *
 * This schema ensures that a nonce is a non-empty string.
 * It applies the following validations:
 * - The value must be a string.
 * - The string must have a minimum length of 1 character.
 *
 * @type {z.ZodString}
 *
 * @example
 * // Valid usage
 * nonceSchema.parse('abc123'); // Returns 'abc123'
 * nonceSchema.parse('a'); // Returns 'a'
 *
 * // Invalid usage (will throw ZodError)
 * nonceSchema.parse(''); // Throws error: String must contain at least 1 character(s)
 * nonceSchema.parse(123); // Throws error: Expected string, received number
 *
 * @throws {z.ZodError} Throws a ZodError if the input fails validation
 */
export const nonceSchema = z.string().min(1);

/**
 * Represents a nonce.
 *
 * A nonce is a unique, typically random or pseudo-random number that is used only once
 * in a cryptographic communication. This class encapsulates a nonce value, ensuring it is non-empty.
 *
 * @class
 * @example
 * // Create a valid Nonce instance
 * const validNonce = new Nonce('abc123');
 * console.log(validNonce.value); // Outputs: 'abc123'
 *
 * // Attempting to create an invalid Nonce will throw an error
 * try {
 *   const invalidNonce = new Nonce('');
 * } catch (error) {
 *   console.error(error.message); // Outputs: 'value is required'
 * }
 */
export class Nonce {
  /**
   * Creates an instance of Nonce.
   *
   * @param {string} value - The value of the nonce.
   * @throws {Error} If the value is falsy (empty, null, undefined, etc.).
   */
  constructor(public value: string) {
    if (!value) {
      throw new Error('value is required');
    }
  }

  /**
   * Returns the string representation of the Nonce.
   *
   * This method is used for JSON serialization.
   *
   * @returns {string} The nonce value.
   */
  toJSON(): string {
    return this.value;
  }
}
