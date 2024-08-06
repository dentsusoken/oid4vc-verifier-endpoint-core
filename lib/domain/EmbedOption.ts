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

import { BuildUrl } from './BuildUrl';

/**
 * Represents an embed option for a resource.
 * @template ID - The type of the resource identifier.
 */
// @ts-expect-error: No problem
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface EmbedOption<ID = unknown> {}

/**
 * Namespace for embed option related classes and functions.
 */
export namespace EmbedOptionNS {
  /**
   * Represents an embed option where the resource is embedded by value.
   */
  export class ByValue implements EmbedOption {}

  /**
   * Represents an embed option where the resource is embedded by reference.
   * @template ID - The type of the resource identifier.
   */
  export class ByReference<ID> implements EmbedOption<ID> {
    /**
     * Creates an instance of ByReference.
     * @param buildUrl - The function to build the URL for the resource.
     */
    constructor(public buildUrl: BuildUrl<ID>) {}
  }

  /**
   * Checks if an embed option is an instance of ByValue.
   * @template ID - The type of the resource identifier.
   * @param embedOption - The embed option to check.
   * @returns True if the embed option is an instance of ByValue, false otherwise.
   */
  export function isByValue<ID>(
    embedOption: EmbedOption<ID>
  ): embedOption is ByValue {
    return embedOption.constructor === ByValue;
  }

  /**
   * Checks if an embed option is an instance of ByReference.
   * @template ID - The type of the resource identifier.
   * @param embedOption - The embed option to check.
   * @returns True if the embed option is an instance of ByReference, false otherwise.
   */
  export function isByReference<ID>(
    embedOption: EmbedOption<ID>
  ): embedOption is ByReference<ID> {
    return embedOption.constructor === ByReference;
  }
}
