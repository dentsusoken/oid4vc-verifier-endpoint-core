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
 * Zod schema for validating response codes.
 *
 * This schema ensures that a response code is a non-empty string.
 * It applies the following validations:
 * - The value must be a string.
 * - The string must have a minimum length of 1 character.
 *
 * @type {z.ZodString}
 *
 * @example
 * // Valid usage
 * responseCodeSchema.parse('200'); // Returns '200'
 * responseCodeSchema.parse('ERROR_001'); // Returns 'ERROR_001'
 *
 * // Invalid usage (will throw ZodError)
 * responseCodeSchema.parse(''); // Throws error: String must contain at least 1 character(s)
 * responseCodeSchema.parse(123); // Throws error: Expected string, received number
 *
 * @throws {z.ZodError} Throws a ZodError if the input fails validation
 */
export const responseCodeSchema = z.string().min(1);

/**
 * Represents a response code.
 *
 * This class encapsulates a response code value, ensuring it is not empty or undefined.
 *
 * @class
 * @example
 * // Create a valid ResponseCode instance
 * const validCode = new ResponseCode('200');
 * console.log(validCode.value); // Outputs: '200'
 *
 * // Attempting to create an invalid ResponseCode will throw an error
 * try {
 *   const invalidCode = new ResponseCode('');
 * } catch (error) {
 *   console.error(error.message); // Outputs: 'value is required'
 * }
 */
export class ResponseCode {
  /**
   * Creates an instance of ResponseCode.
   *
   * @param {string} value - The response code value.
   * @throws {Error} Throws an Error if the value is falsy (empty, null, undefined, etc.).
   */
  constructor(public value: string) {
    if (!value) {
      throw new Error('value is required');
    }
  }

  /**
   * Returns the string representation of the ResponseCode.
   *
   * This method is used for JSON serialization.
   *
   * @returns {string} The response code value.
   */
  toJSON(): string {
    return this.value;
  }
}
