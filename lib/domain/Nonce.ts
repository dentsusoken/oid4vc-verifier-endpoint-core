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

import { FromJSON } from '../common/json/FromJSON';
import { z } from 'zod';

const schema = z.string().min(1);
/**
 * Represents a nonce.
 */
export class Nonce {
  static fromJSON: FromJSON<Nonce> = (json) => {
    const value = schema.parse(json);

    return new Nonce(value);
  };

  /**
   * Creates an instance of Nonce.
   * @param {string} value - The value of the nonce.
   * @throws {Error} If the value is falsy (empty, null, undefined, etc.).
   */
  constructor(public value: string) {
    if (!value) {
      throw new Error('value is required');
    }
  }

  toJSON(): string {
    return this.value;
  }
}
