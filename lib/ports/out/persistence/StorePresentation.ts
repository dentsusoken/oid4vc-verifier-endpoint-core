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

import { Presentation } from '../../../domain';

/**
 * Interface for storing or updating a presentation.
 * @interface StorePresentation
 */
export interface StorePresentation {
  /**
   * Stores or updates a presentation.
   * @function
   * @name StorePresentation
   * @param {Presentation} presentation - The presentation to be stored or updated.
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   */
  (presentation: Presentation): Promise<void>;
}
