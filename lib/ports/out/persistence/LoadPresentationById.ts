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

import { Presentation, TransactionId } from '../../../domain';

/**
 * Interface for loading a presentation by its transaction ID.
 * @interface LoadPresentationById
 */
export interface LoadPresentationById {
  /**
   * Loads a presentation by its transaction ID.
   * @function
   * @name LoadPresentationById
   * @param {TransactionId} presentationProcessById - The transaction ID of the presentation to load.
   * @returns {Promise<Presentation | undefined>} A promise that resolves to the loaded presentation or undefined if not found.
   */
  (presentationProcessById: TransactionId): Promise<Presentation | undefined>;
}
