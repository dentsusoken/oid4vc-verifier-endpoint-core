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

/**
 * Represents the method to get the wallet response.
 * @typedef {GetWalletResponseMethod.Poll | GetWalletResponseMethod.Redirect} GetWalletResponseMethod
 */
export type GetWalletResponseMethod =
  | GetWalletResponseMethod.Poll
  | GetWalletResponseMethod.Redirect;

/**
 * Schema for the Poll object.
 * @type {z.ZodObject<{__type: z.ZodLiteral<'Poll'>}, "strip", z.ZodTypeAny, {__type: "Poll"}, {__type: "Poll"}>}
 */
const pollSchema = z.object({
  __type: z.literal('Poll'),
});

/**
 * Schema for the Redirect object.
 * @typedef {Object} RedirectSchema
 * @property {string} __type - The type of the object, must be 'Redirect'.
 * @property {string} redirect_uri_template - The template for the redirect URI, must be a valid URL.
 */
const redirectSchema = z.object({
  __type: z.literal('Redirect'),
  redirect_uri_template: z.string().url(),
});

/**
 * Schema for the GetWalletResponseMethod discriminated union.
 * @typedef {Object} GetWalletResponseMethodSchema
 * @property {string} __type - The discriminator property, must be either 'Poll' or 'Redirect'.
 * @property {string} [redirect_uri_template] - The template for the redirect URI, must be a valid URL. Required if __type is 'Redirect'.
 */
export const getWalletResponseMethodSchema = z.discriminatedUnion('__type', [
  pollSchema,
  redirectSchema,
]);

/**
 * JSON type for the GetWalletResponseMethod discriminated union.
 * @typedef {Object} GetWalletResponseMethodJSON
 * @property {string} __type - The discriminator property, must be either 'Poll' or 'Redirect'.
 * @property {string} [redirect_uri_template] - The template for the redirect URI, must be a valid URL. Required if __type is 'Redirect'.
 */
export type GetWalletResponseMethodJSON = z.infer<
  typeof getWalletResponseMethodSchema
>;

/**
 * Namespace for GetWalletResponseMethod related classes and functions.
 * @namespace GetWalletResponseMethod
 */
export namespace GetWalletResponseMethod {
  type Type = 'Poll' | 'Redirect';

  /**
   * Creates a GetWalletResponseMethod instance from its JSON representation.
   * @function fromJSON
   * @param {GetWalletResponseMethodJSON} json - The JSON representation of the GetWalletResponseMethod.
   * @returns {GetWalletResponseMethod} The GetWalletResponseMethod instance created from the JSON.
   * @throws {Error} If the __type property of the JSON is not recognized.
   */
  export const fromJSON: FromJSON<
    GetWalletResponseMethodJSON,
    GetWalletResponseMethod
  > = (json) => {
    switch (json.__type) {
      case 'Poll':
        return Poll.INSTANCE;
      case 'Redirect':
        return new Redirect(json.redirect_uri_template);
    }
  };

  /**
   * Interface representing a GetWalletResponseMethod.
   * @interface GetWalletResponseMethod
   */
  interface Base {
    /**
     * The type of the GetWalletResponseMethod.
     * @type {('Poll' | 'Redirect')}
     * @readonly
     */
    readonly __type: Type;

    /**
     * Converts the GetWalletResponseMethod to its JSON representation.
     * @returns {GetWalletResponseMethodJSON} The JSON representation of the GetWalletResponseMethod.
     */
    toJSON(): GetWalletResponseMethodJSON;
  }

  /**
   * Represents a polling method to get the wallet response.
   * @class Poll
   * @implements {Base}
   */
  export class Poll implements Base {
    /**
     * The singleton instance of the Poll class.
     * @type {Poll}
     * @static
     * @readonly
     */
    static readonly INSTANCE = new Poll();

    /**
     * The type of the GetWalletResponseMethod.
     * @type {('Poll')}
     * @readonly
     */
    readonly __type = 'Poll' as const;

    /**
     * Private constructor to enforce singleton pattern.
     * @private
     */
    private constructor() {}

    /**
     * Converts the Poll instance to its JSON representation.
     * @returns {GetWalletResponseMethodJSON} The JSON representation of the Poll instance.
     */
    toJSON() {
      return { __type: this.__type };
    }
  }

  /**
   * Represents a redirect method to get the wallet response.
   * @class Redirect
   * @implements {Base}
   */
  export class Redirect implements Base {
    /**
     * The type of the GetWalletResponseMethod.
     * @type {('Redirect')}
     * @readonly
     */
    readonly __type = 'Redirect' as const;

    /**
     * Creates an instance of Redirect.
     * @param {string} redirectUriTemplate - The redirect URI template.
     */
    constructor(public redirectUriTemplate: string) {}

    /**
     * Converts the Redirect instance to its JSON representation.
     * @returns {GetWalletResponseMethodJSON} The JSON representation of the Redirect instance.
     */
    toJSON() {
      return {
        __type: this.__type,
        redirect_uri_template: this.redirectUriTemplate,
      };
    }
  }
}
