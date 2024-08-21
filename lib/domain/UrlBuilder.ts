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
import { RequestId } from './RequestId';
import { FromJSON } from '../common/json/FromJSON';

/**
 * Represents a URL builder for constructing URLs in different scenarios.
 * @typedef {Object} UrlBuilder
 * @description This type is a union of two possible URL builder implementations:
 * WithRequestId and Fix. The specific implementation determines how the URL is constructed.
 *
 * @property {UrlBuilder.WithRequestId} WithRequestId - A URL builder that incorporates a request ID into the URL.
 * @property {UrlBuilder.Fix} Fix - A URL builder that constructs a fixed URL, ignoring the provided request ID.
 *
 * @example
 * // Using WithRequestId
 * const withRequestIdBuilder: UrlBuilder = new UrlBuilder.WithRequestId('https://example.com/');
 * const urlWithRequestId = withRequestIdBuilder.buildUrl(new RequestId('123'));
 *
 * // Using Fix
 * const fixBuilder: UrlBuilder = new UrlBuilder.Fix('https://example.com/fixed');
 * const fixedUrl = fixBuilder.buildUrl(new RequestId('123')); // RequestId is ignored
 */
export type UrlBuilder = UrlBuilder.WithRequestId | UrlBuilder.Fix;

/**
 * Schema for the WithRequestId URL builder.
 * @type {z.ZodObject<{__type: z.ZodLiteral<'WithRequestId'>, base_url: z.ZodString}, "strip", z.ZodTypeAny, {__type: "WithRequestId", base_url: string}, {__type: "WithRequestId", base_url: string}>}
 */
const withRequestIdSchema = z.object({
  __type: z.literal('WithRequestId'),
  base_url: z.string().url(),
});

/**
 * Schema for the Fix URL builder.
 * @typedef {Object} FixSchema
 * @property {string} __type - The type discriminator, must be 'Fix'.
 * @property {string} url - The fixed URL string. Must be a valid URL.
 *
 * @description This schema defines the structure for a Fix URL builder,
 * which represents a fixed URL that doesn't change based on input parameters.
 *
 * @example
 * const validFixObject = {
 *   __type: 'Fix',
 *   url: 'https://example.com/fixed'
 * };
 *
 * const isValid = fixSchema.safeParse(validFixObject).success;
 * console.log(isValid); // true
 */
const fixSchema = z.object({
  __type: z.literal('Fix'),
  url: z.string().url(),
});

export const urlBuilderSchema = z.discriminatedUnion('__type', [
  withRequestIdSchema,
  fixSchema,
]);

/**
 * JSON type for the URL builder.
 * @typedef {z.infer<typeof urlBuilderSchema>} UrlBuilderJSON
 */
export type UrlBuilderJSON = z.infer<typeof urlBuilderSchema>;

/**
 * Namespace for URL builder related types and functions.
 * @namespace UrlBuilder
 */
export namespace UrlBuilder {
  /**
   * Function to create a UrlBuilder instance from JSON.
   * @function fromJSON
   * @param {UrlBuilderJSON} json - The JSON object representing the URL builder.
   * @returns {UrlBuilder} The UrlBuilder instance created from the JSON.
   */
  export const fromJSON: FromJSON<UrlBuilderJSON, UrlBuilder> = (json) => {
    switch (json.__type) {
      case 'WithRequestId':
        return new WithRequestId(json.base_url);
      case 'Fix':
        return new Fix(json.url);
    }
  };

  /**
   * Builds a URL using the provided UrlBuilder and RequestId.
   * This function handles both WithRequestId and Fix types of UrlBuilder.
   *
   * @param {UrlBuilder} urlBuilder - The URL builder to use. Can be either WithRequestId or Fix type.
   * @param {RequestId} requestId - The request ID to use when building the URL.
   *                                This is used only for WithRequestId type builders.
   *
   * @returns {URL} The built URL.
   *
   * @throws {Error} Implicitly throws an error if an unknown UrlBuilder type is provided.
   *
   * @example
   * const withRequestIdBuilder = new UrlBuilder.WithRequestId('https://example.com/');
   * const requestId = new RequestId('123');
   * const url1 = buildUrlWithRequestId(withRequestIdBuilder, requestId);
   * console.log(url1.href); // Outputs: https://example.com/123
   *
   * const fixBuilder = new UrlBuilder.Fix('https://example.com/fixed');
   * const url2 = buildUrlWithRequestId(fixBuilder, requestId);
   * console.log(url2.href); // Outputs: https://example.com/fixed
   */
  export const buildUrlWithRequestId = (
    urlBuilder: UrlBuilder,
    requestId: RequestId
  ) => {
    switch (urlBuilder.__type) {
      case 'WithRequestId':
        return urlBuilder.buildUrl(requestId);
      case 'Fix':
        return urlBuilder.buildUrl(undefined as never);
    }
  };

  /**
   * Base interface for URL builders.
   * @interface Base
   * @template ID - The type of the ID used in the URL builder.
   * @property {string} __type - The type of the URL builder.
   * @property {function(ID): URL} buildUrl - Function to build the URL based on the provided ID.
   * @property {function(): UrlBuilderJSON} toJSON - Function to convert the URL builder to its JSON representation.
   */
  interface Base<ID> {
    readonly __type: 'WithRequestId' | 'Fix';

    buildUrl(id: ID): URL;

    toJSON(): UrlBuilderJSON;
  }

  /**
   * Class representing a URL builder with request ID.
   * @class WithRequestId
   * @implements {Base<RequestId>}
   * @property {string} __type - The type of the URL builder.
   * @property {string} baseUrl - The base URL.
   */
  export class WithRequestId implements Base<RequestId> {
    readonly __type = 'WithRequestId' as const;

    /**
     * Creates an instance of WithRequestId.
     * @constructor
     * @param {string} baseUrl - The base URL.
     */
    constructor(public baseUrl: string) {}

    /**
     * Builds the URL based on the provided request ID.
     * @method buildUrl
     * @param {RequestId} id - The request ID.
     * @returns {URL} The built URL.
     */
    buildUrl(id: RequestId): URL {
      return new URL(`${this.baseUrl}${id.value}`);
    }

    /**
     * Converts the URL builder to its JSON representation.
     * @method toJSON
     * @returns {UrlBuilderJSON} The JSON representation of the URL builder.
     */
    toJSON() {
      return {
        __type: this.__type,
        base_url: this.baseUrl,
      };
    }
  }

  export class Fix implements Base<never> {
    readonly __type = 'Fix' as const;

    constructor(public url: string) {}

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    buildUrl(_: never): URL {
      return new URL(`${this.url}`);
    }

    toJSON() {
      return {
        __type: this.__type,
        url: this.url,
      };
    }
  }
}
