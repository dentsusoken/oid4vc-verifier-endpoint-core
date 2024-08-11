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

import { Result } from '../../kotlin';
import {
  InitTransactionTO,
  JwtSecuredAuthorizationRequestTO,
} from './InitTransaction.types';

/**
 * This is a use case that initializes the [Presentation] process.
 *
 * The caller may define via [InitTransactionTO] what kind of transaction wants to initiate
 * This is represented by [PresentationTypeTO].
 *
 * Use case will initialize a [Presentation] process
 */
export interface InitTransaction {
  /**
   * Initializes the [Presentation] process.
   *
   * @param {InitTransactionTO} initTransactionTO - The initialization transaction transfer object.
   * @returns {Promise<JwtSecuredAuthorizationRequestTO>} A promise that resolves to the JWT secured authorization request transfer object.
   */
  (initTransactionTO: InitTransactionTO): Promise<
    Result<JwtSecuredAuthorizationRequestTO>
  >;
}
