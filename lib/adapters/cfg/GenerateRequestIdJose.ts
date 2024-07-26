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

import { GenerateRequestId } from '../../ports/out/cfg';
import { RequestId } from '../../domain';
import { base64url } from 'jose';

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
export const createGenerateRequestIdHoseInvoker = (
  byteLength: number
): GenerateRequestId => {
  return () => new GenerateRequestIdJose(byteLength).invoke();
};

/**
 * Generates a request ID using the JOSE library.
 */
class GenerateRequestIdJose {
  private static readonly DEFAULT_BYTE_LENGTH = 32;
  private readonly byteLength: number;

  /**
   * Creates a new instance of GenerateRequestIdJose.
   * @param byteLength The byte length of the generated request ID. Defaults to 32 bytes.
   * @throws {Error} If the byte length is less than 32.
   */
  constructor(byteLength: number = GenerateRequestIdJose.DEFAULT_BYTE_LENGTH) {
    if (byteLength < 32) {
      throw new Error('The byte length must be greater than or equal to 32');
    }
    this.byteLength = byteLength;
  }

  /**
   * Generates a new request ID.
   * @returns A Promise that resolves to the generated [RequestId]
   */
  invoke: GenerateRequestId = (): Promise<RequestId> => {
    const value = this.generateRandomValue();
    return Promise.resolve(new RequestId(value));
  };

  /**
   * Generates a random Base64URL-encoded value of the specified byte length.
   * @returns The generated random value as a string.
   */
  private generateRandomValue(): string {
    const buffer = new Uint8Array(this.byteLength);
    crypto.getRandomValues(buffer);
    return base64url.encode(buffer);
  }
}
