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

import { GenerateRequestId } from '../../../ports/out/cfg';
import { RequestId } from '../../../domain';
import { runAsyncCatching } from '@vecrea/oid4vc-core/utils';

import { randomBase64URL } from '../../../utils';

const DEFAULT_BYTE_LENGTH = 32;

/**
 * Creates a function that generates a request ID using the GenerateRequestIdJose class.
 *
 * @param byteLength The byte length of the generated request ID.
 * @returns A function that generates a request ID.
 * @throws {Error} If the byte length is less than 32.
 *
 * @example
 * const generateRequestId = createGenerateRequestIdHoseInvoker(32);
 * const requestId = await generateRequestId();
 */
export const createGenerateRequestIdHoseInvoker =
  (byteLength: number = DEFAULT_BYTE_LENGTH): GenerateRequestId =>
  () =>
    runAsyncCatching(async () => {
      if (byteLength < 32) {
        throw new Error('The byte length must be greater than or equal to 32');
      }
      const value = randomBase64URL(byteLength);
      return new RequestId(value);
    });
