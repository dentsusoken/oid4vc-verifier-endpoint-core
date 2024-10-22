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
import { runAsyncCatching } from 'oid4vc-core/utils';

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
export const createGenerateTransactionIdJoseInvoker =
  (byteLength: number = DEFAULT_BYTE_LENGTH): GenerateTransactionId =>
  () =>
    runAsyncCatching(async () => {
      if (byteLength < 32) {
        throw new Error('The byte length must be greater than or equal to 32');
      }
      const value = randomBase64URL(byteLength);
      return new TransactionId(value);
    });
