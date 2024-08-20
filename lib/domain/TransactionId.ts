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
 * Zod schema for validating transaction IDs.
 *
 * This schema ensures that a transaction ID is a non-empty string.
 * It applies the following validations:
 * - The value must be a string.
 * - The string must have a minimum length of 1 character.
 *
 * @type {z.ZodString}
 *
 * @example
 * // Valid usage
 * transactionIdSchema.parse('abc123'); // Returns 'abc123'
 * transactionIdSchema.parse('T-001'); // Returns 'T-001'
 *
 * // Invalid usage (will throw ZodError)
 * transactionIdSchema.parse(''); // Throws error: String must contain at least 1 character(s)
 * transactionIdSchema.parse(123); // Throws error: Expected string, received number
 *
 * @throws {z.ZodError} Throws a ZodError if the input fails validation
 */
export const transactionIdSchema = z.string().min(1);

/**
 * Represents a transaction ID.
 */
export class TransactionId {
  /**
   * Creates an instance of TransactionId.
   * @param {string} value - The value of the transaction ID.
   * @throws {Error} If the value is falsy (empty, null, undefined, etc.).
   */
  constructor(public value: string) {
    if (!value) {
      throw new Error('value is required');
    }
  }

  /**
   * Returns the JSON representation of the TransactionId.
   * @returns {string} The JSON representation of the TransactionId.
   */
  toJSON(): string {
    return this.value;
  }
}
