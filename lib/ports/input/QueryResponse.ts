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

/**
 * Represents the response of a query.
 * @template T - The type of the value in the Found response.
 * @typedef {QueryResponse.NotFound | QueryResponse.InvalidState | QueryResponse.Found<T>} QueryResponse
 */
export type QueryResponse<T> =
  | QueryResponse.NotFound
  | QueryResponse.InvalidState
  | QueryResponse.Found<T>;

/**
 * Namespace for QueryResponse related classes and types.
 * @namespace QueryResponse
 */
export namespace QueryResponse {
  /**
   * Interface representing a QueryResponse.
   * @interface QueryResponse
   */
  interface QueryResponse {
    /**
     * The type of the QueryResponse.
     * @type {('NotFound' | 'InvalidState' | 'Found')}
     * @readonly
     */
    readonly __type: 'NotFound' | 'InvalidState' | 'Found';
  }

  /**
   * Represents a NotFound response.
   * @class NotFound
   * @implements {QueryResponse}
   */
  export class NotFound implements QueryResponse {
    /**
     * The type of the QueryResponse.
     * @type {('NotFound')}
     * @readonly
     */
    readonly __type = 'NotFound';

    /**
     * Constructor for the class.
     * @param {string} message - The error message associated with this response.
     */
    constructor(public message: string) {}
  }

  /**
   * Represents an InvalidState response.
   * @class InvalidState
   * @implements {QueryResponse}
   */
  export class InvalidState implements QueryResponse {
    /**
     * The type of the QueryResponse.
     * @type {('InvalidState')}
     * @readonly
     */
    readonly __type = 'InvalidState';

    /**
     * Constructor for the class.
     * @param {string} message - The error message associated with this response.
     */
    constructor(public message: string) {}
  }

  /**
   * Represents a Found response with a value.
   * @class Found
   * @implements {QueryResponse}
   * @template T - The type of the value.
   */
  export class Found<T> implements QueryResponse {
    /**
     * The type of the QueryResponse.
     * @type {('Found')}
     * @readonly
     */
    readonly __type = 'Found' as const;

    /**
     * Creates an instance of Found.
     * @param {T} value - The value of the Found response.
     */
    constructor(public readonly value: T) {}
  }
}
