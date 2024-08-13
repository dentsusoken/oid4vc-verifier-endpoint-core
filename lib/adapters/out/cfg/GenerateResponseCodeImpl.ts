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

import { GenerateResponseCode } from '../../../ports/out/cfg';
import { ResponseCode } from '../../../domain';
import { v4 as uuidv4 } from 'uuid';

/**
 * Creates a function to generate a response code
 * @returns {GenerateResponseCode} A function that generates a response code
 */
export const createGenerateResponseCodeInvoker = (): GenerateResponseCode =>
  invoke;

/**
 * Generates a new response code using UUID v4
 * @async
 * @returns {Promise<ResponseCode>} A Promise that resolves to a new ResponseCode
 */
const invoke: GenerateResponseCode = async () => {
  const value = uuidv4();
  return new ResponseCode(value);
};
