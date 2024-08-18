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
 * Represents a transaction ID.
 */

import { FromJSON } from '../common/json/FromJSON';
import { z } from 'zod';

const schema = z.string().min(1);

/**
 * Represents a transaction ID.
 */
export class TransactionId {
  /**
   * Creates a TransactionId instance from a JSON value.
   * @type {FromJSON<TransactionId>}
   * @param {unknown} json - The JSON value representing the transaction ID.
   * @returns {TransactionId} The TransactionId instance.
   * @throws {ZodError} If the JSON value is not a valid non-empty string.
   */
  static fromJSON: FromJSON<TransactionId> = (json) => {
    const value = schema.parse(json);

    return new TransactionId(value);
  };

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
