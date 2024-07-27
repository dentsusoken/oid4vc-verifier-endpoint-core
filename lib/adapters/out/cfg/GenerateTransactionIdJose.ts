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

import { GenerateTransactionId } from '../../../ports/out/cfg';
import { TransactionId } from '../../../domain';
import { randomBase64URL } from '../../../utils';

const DEFAULT_BYTE_LENGTH = 32;

/**
 * Creates a function that generates a transaction ID.
 *
 * @param byteLength The byte length of the generated transaction ID.
 * @returns A function that generates a transaction ID.
 * @throws {Error} If the byte length is less than 32.
 *
 * @example
 * const generateTransactionId = createGenerateTransactionIdInvoker(32);
 * const transactionId = await generateTransactionId();
 */
export const createGenerateTransactionIdInvoker = (
  byteLength: number
): GenerateTransactionId => {
  return () => new GenerateTransactionIdJose(byteLength).invoke();
};

/**
 * Generates a transaction ID using a secure random number generator.
 */
class GenerateTransactionIdJose {
  private readonly byteLength: number;

  /**
   * Creates a new instance of GenerateTransactionIdJose.
   * @param byteLength The byte length of the generated transaction ID. Defaults to 32 bytes.
   * @throws {Error} If the byte length is less than 32.
   */
  constructor(byteLength: number = DEFAULT_BYTE_LENGTH) {
    if (byteLength < 32) {
      throw new Error('The byte length must be greater than or equal to 32');
    }
    this.byteLength = byteLength;
  }

  /**
   * Generates a new transaction ID.
   * @returns A Promise that resolves to the generated [TransactionId]
   */
  invoke: GenerateTransactionId = (): Promise<TransactionId> => {
    const value = randomBase64URL(this.byteLength);
    return Promise.resolve(new TransactionId(value));
  };
}
