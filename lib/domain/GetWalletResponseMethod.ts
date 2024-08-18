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

/**
 * Represents the method to get the wallet response.
 * @typedef {GetWalletResponseMethod.Poll | GetWalletResponseMethod.Redirect} GetWalletResponseMethod
 */
export type GetWalletResponseMethod =
  | GetWalletResponseMethod.Poll
  | GetWalletResponseMethod.Redirect;

/**
 * Namespace for GetWalletResponseMethod related classes and functions.
 * @namespace GetWalletResponseMethod
 */
export namespace GetWalletResponseMethod {
  type Type = 'Poll' | 'Redirect';

  export type GetWalletResponseMethodJSONType = {
    __type: Type;
    [index: string]: unknown;
  };

  /**
   * Interface representing a GetWalletResponseMethod.
   * @interface GetWalletResponseMethod
   */
  interface GetWalletResponseMethod {
    /**
     * The type of the GetWalletResponseMethod.
     * @type {('Poll' | 'Redirect')}
     * @readonly
     */
    readonly __type: Type;

    toJSON(): GetWalletResponseMethodJSONType;
  }

  /**
   * Represents a polling method to get the wallet response.
   * @class Poll
   * @implements {GetWalletResponseMethod}
   */
  export class Poll implements GetWalletResponseMethod {
    /**
     * The singleton instance of the Poll class.
     * @type {Poll}
     * @static
     * @readonly
     */
    static readonly INSTANCE = new Poll();

    static schema = z.object({
      __type: z.literal('Poll'),
    });

    static fromJSON: FromJSON<Poll> = (json) => {
      this.schema.parse(json);

      return this.INSTANCE;
    };

    /**
     * The type of the GetWalletResponseMethod.
     * @type {('Poll')}
     * @readonly
     */
    readonly __type = 'Poll';

    /**
     * Private constructor to enforce singleton pattern.
     * @private
     */
    private constructor() {}

    toJSON(): { __type: 'Poll' } {
      return { __type: this.__type };
    }
  }

  /**
   * Represents a redirect method to get the wallet response.
   * @class Redirect
   * @implements {GetWalletResponseMethod}
   */
  export class Redirect implements GetWalletResponseMethod {
    static schema = z.object({
      __type: z.literal('Redirect'),
      redirect_uri_template: z.string().min(1),
    });

    /**
     * The type of the GetWalletResponseMethod.
     * @type {('Redirect')}
     * @readonly
     */
    readonly __type = 'Redirect';

    static fromJSON: FromJSON<Redirect> = (json) => {
      const { redirect_uri_template } = this.schema.parse(json);

      return new Redirect(redirect_uri_template);
    };

    /**
     * Creates an instance of Redirect.
     * @param {string} redirectUriTemplate - The redirect URI template.
     */
    constructor(public redirectUriTemplate: string) {}

    toJSON(): { __type: 'Redirect'; redirect_uri_template: string } {
      return {
        __type: this.__type,
        redirect_uri_template: this.redirectUriTemplate,
      };
    }
  }
}
