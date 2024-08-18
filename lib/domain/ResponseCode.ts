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
import { FromJSON } from '../common/json/FromJSON';

const schema = z.string().min(1);

/**
 * Represents a response code.
 *
 * @class ResponseCode
 *
 * @param {string} value - The value of the response code.
 */
export class ResponseCode {
  static fromJSON: FromJSON<ResponseCode> = (json) => {
    const value = schema.parse(json);

    return new ResponseCode(value);
  };

  constructor(public value: string) {
    schema.parse(value);
  }

  toJSON(): string {
    return this.value;
  }
}
