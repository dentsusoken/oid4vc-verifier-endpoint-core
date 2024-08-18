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

import { PresentationDefinition } from 'oid4vc-prex';
import { IdTokenType } from '.';
import { FromJSON } from '../common/json/FromJSON';

/**
 * Represents the type of presentation request.
 * @typedef {PresentationType.IdTokenRequest | PresentationType.VpTokenRequest | PresentationType.IdAndVpTokenRequest} PresentationType
 */
export type PresentationType =
  | PresentationType.IdTokenRequest
  | PresentationType.VpTokenRequest
  | PresentationType.IdAndVpTokenRequest;

/**
 * Namespace containing implementations and type guards for various PresentationType.
 */
export namespace PresentationType {
  type Type = 'IdTokenRequest' | 'VpTokenRequest' | 'IdAndVpTokenRequest';

  interface PresentationType {
    readonly __type: Type;

    toJSON(): {
      __type: Type;
      [index: string]: unknown;
    };
  }

  /**
   * Represents a request for an ID token.
   */
  export class IdTokenRequest implements PresentationType {
    readonly __type = 'IdTokenRequest' as const;

    /**
     * Creates an instance of IdTokenRequest from a JSON object.
     * @type {FromJSON<IdTokenRequest>}
     * @param {unknown} json - The JSON object to create the IdTokenRequest from.
     * @returns {IdTokenRequest} The created IdTokenRequest instance.
     * @throws {Error} If the __type property in the JSON object is not 'IdTokenRequest'.
     * @throws {Error} If the id_token_type property is missing in the JSON object.
     */
    static fromJSON: FromJSON<IdTokenRequest> = (json) => {
      const { __type, id_token_type } = json as {
        __type: string;
        id_token_type: string[];
      };

      if (__type !== 'IdTokenRequest') {
        throw new Error(
          `Invalid __type. Expected 'IdTokenRequest', but '${__type}'`
        );
      }

      if (!id_token_type) {
        throw new Error('Missing id_token_type');
      }

      return new IdTokenRequest(
        id_token_type.map((v) => IdTokenType.fromJSON(v))
      );
    };

    /**
     * Creates an instance of IdTokenRequest.
     * @param idTokenType - An array of ID token types.
     */
    constructor(public idTokenType: IdTokenType[]) {}

    /**
     * Returns the JSON representation of the IdTokenRequest instance.
     * @returns {{ __type: 'IdTokenRequest'; id_token_type: string[] }} The JSON representation of the IdTokenRequest.
     */
    toJSON(): { __type: 'IdTokenRequest'; id_token_type: string[] } {
      return {
        __type: this.__type,
        id_token_type: this.idTokenType.map((v) => IdTokenType.toJSON(v)),
      };
    }
  }

  /**
   * Represents a request for a VP token.
   */
  export class VpTokenRequest implements PresentationType {
    readonly __type = 'VpTokenRequest' as const;

    /**
     * Creates an instance of VpTokenRequest from a JSON object.
     * @type {FromJSON<VpTokenRequest>}
     * @param {unknown} json - The JSON object to create the VpTokenRequest from.
     * @returns {VpTokenRequest} The created VpTokenRequest instance.
     * @throws {Error} If the __type property in the JSON object is not 'VpTokenRequest'.
     * @throws {Error} If the presentation_definition property in the JSON object is invalid.
     */
    static fromJSON: FromJSON<VpTokenRequest> = (json) => {
      const { __type, presentation_definition } = json as {
        __type: string;
        presentation_definition: object;
      };

      if (__type !== 'VpTokenRequest') {
        throw new Error(
          `Invalid __type. Expected 'VpTokenRequest', but '${__type}'`
        );
      }

      if (!presentation_definition) {
        throw new Error('Missing presentation_definition');
      }

      const pd = PresentationDefinition.deserialize(presentation_definition);

      if (!(pd instanceof PresentationDefinition)) {
        throw new Error(
          `Invalid presentation_definition: ${presentation_definition}`
        );
      }

      return new VpTokenRequest(pd);
    };

    /**
     * Creates an instance of VpTokenRequest.
     * @param presentationDefinition - The presentation definition for the VP token.
     */
    constructor(public presentationDefinition: PresentationDefinition) {}

    /**
     * Returns the JSON representation of the VpTokenRequest instance.
     * @returns {{ __type: 'VpTokenRequest'; presentation_definition: object }} The JSON representation of the VpTokenRequest.
     */
    toJSON(): { __type: 'VpTokenRequest'; presentation_definition: object } {
      return {
        __type: this.__type,
        presentation_definition: this.presentationDefinition.serialize(),
      };
    }
  }

  /**
   * Represents a request for both an ID token and a VP token.
   */
  export class IdAndVpTokenRequest implements PresentationType {
    readonly __type = 'IdAndVpTokenRequest' as const;

    static fromJSON: FromJSON<IdAndVpTokenRequest> = (json) => {
      const { __type, id_token_type, presentation_definition } = json as {
        __type: string;
        id_token_type: string[];
        presentation_definition: object;
      };

      if (__type !== 'IdAndVpTokenRequest') {
        throw new Error(
          `Invalid __type. Expected 'IdAndVpTokenRequest', but '${__type}'`
        );
      }

      if (!id_token_type) {
        throw new Error('Missing id_token_type');
      }

      if (!presentation_definition) {
        throw new Error('Missing presentation_definition');
      }

      const pd = PresentationDefinition.deserialize(presentation_definition);

      if (!(pd instanceof PresentationDefinition)) {
        throw new Error(
          `Invalid presentation_definition: ${presentation_definition}`
        );
      }

      return new IdAndVpTokenRequest(
        id_token_type.map((v) => IdTokenType.fromJSON(v)),
        pd
      );
    };

    /**
     * Creates an instance of IdAndVpTokenRequest.
     * @param idTokenType - An array of ID token types.
     * @param presentationDefinition - The presentation definition for the VP token.
     */
    constructor(
      public idTokenType: IdTokenType[],
      public presentationDefinition: PresentationDefinition
    ) {}

    toJSON(): {
      __type: 'IdAndVpTokenRequest';
      id_token_type: string[];
      presentation_definition: object;
    } {
      return {
        __type: this.__type,
        id_token_type: this.idTokenType.map((v) => IdTokenType.toJSON(v)),
        presentation_definition: this.presentationDefinition.serialize(),
      };
    }
  }
}
