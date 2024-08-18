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
import { PresentationSubmission } from 'oid4vc-prex';
import { Jwt } from '.';

/**
 * Represents the response from a wallet.
 * @typedef {IdToken | VpToken | IdAndVpToken | WalletResponseError} WalletResponse
 */
export type WalletResponse =
  | WalletResponse.IdToken
  | WalletResponse.VpToken
  | WalletResponse.IdAndVpToken
  | WalletResponse.WalletResponseError;

export namespace WalletResponse {
  type Type = 'IdToken' | 'VpToken' | 'IdAndVpToken' | 'WalletResponseError';

  export type WalletResponseJSONType = {
    __type: Type;
    [index: string]: unknown;
  };
  /**
   * Interface for wallet response types.
   * @interface WalletResponse
   * @property {string} __type - The type of the wallet response.
   */
  interface WalletResponse {
    readonly __type: Type;

    toJSON(): WalletResponseJSONType;
  }

  /**
   * Represents an ID token wallet response.
   * @class IdToken
   * @implements {WalletResponse}
   * @property {string} __type - The type of the wallet response.
   * @property {Jwt} idToken - The ID token.
   */
  export class IdToken implements WalletResponse {
    static schema = z.object({
      __type: z.literal('IdToken'),
      id_token: z.string().min(1),
    });

    readonly __type = 'IdToken';

    static fromJSON: FromJSON<IdToken> = (json) => {
      const { id_token } = this.schema.parse(json);

      return new IdToken(id_token);
    };

    /**
     * Creates an instance of IdToken.
     * @constructor
     * @param {Jwt} idToken - The ID token.
     * @throws {Error} If the ID token is not provided.
     */
    constructor(public idToken: Jwt) {
      if (!idToken) {
        throw new Error('idToken is required');
      }
    }

    toJSON = (): { __type: 'IdToken'; id_token: Jwt } => ({
      __type: this.__type,
      id_token: this.idToken,
    });
  }

  /**
   * Represents a VP token wallet response.
   * @class VpToken
   * @implements {WalletResponse}
   * @property {string} __type - The type of the wallet response.
   * @property {Jwt} vpToken - The VP token.
   * @property {PresentationSubmission} presentationSubmission - The presentation submission.
   */
  export class VpToken implements WalletResponse {
    static schema = z.object({
      __type: z.literal('VpToken'),
      vp_token: z.string().min(1),
      presentation_submission: z.any(),
    });

    readonly __type = 'VpToken';

    static fromJSON: FromJSON<VpToken> = (json) => {
      const { vp_token, presentation_submission } = this.schema.parse(json);

      return new VpToken(
        vp_token,
        PresentationSubmission.deserialize(presentation_submission)
      );
    };

    /**
     * Creates an instance of VpToken.
     * @constructor
     * @param {Jwt} vpToken - The VP token.
     * @param {PresentationSubmission} presentationSubmission - The presentation submission.
     * @throws {Error} If the VP token is not provided.
     */
    constructor(
      public vpToken: Jwt,
      public presentationSubmission: PresentationSubmission
    ) {
      if (!vpToken) {
        throw new Error('vpToken is required');
      }
    }

    toJSON = (): {
      __type: 'VpToken';
      vp_token: Jwt;
      presentation_submission: object;
    } => ({
      __type: this.__type,
      vp_token: this.vpToken,
      presentation_submission: this.presentationSubmission.serialize(),
    });
  }

  /**
   * Represents an ID and VP token wallet response.
   * @class IdAndVpToken
   * @implements {WalletResponse}
   * @property {string} __type - The type of the wallet response.
   * @property {Jwt} idToken - The ID token.
   * @property {Jwt} vpToken - The VP token.
   * @property {PresentationSubmission} presentationSubmission - The presentation submission.
   */
  export class IdAndVpToken implements WalletResponse {
    static schema = z.object({
      __type: z.literal('IdAndVpToken'),
      id_token: z.string().min(1),
      vp_token: z.string().min(1),
      presentation_submission: z.any(),
    });

    readonly __type = 'IdAndVpToken';

    static fromJSON: FromJSON<IdAndVpToken> = (json) => {
      const { id_token, vp_token, presentation_submission } =
        this.schema.parse(json);

      return new IdAndVpToken(
        id_token,
        vp_token,
        PresentationSubmission.deserialize(presentation_submission)
      );
    };

    /**
     * Creates an instance of IdAndVpToken.
     * @constructor
     * @param {Jwt} idToken - The ID token.
     * @param {Jwt} vpToken - The VP token.
     * @param {PresentationSubmission} presentationSubmission - The presentation submission.
     * @throws {Error} If the ID token or VP token is not provided.
     */
    constructor(
      public idToken: Jwt,
      public vpToken: Jwt,
      public presentationSubmission: PresentationSubmission
    ) {
      if (!idToken) {
        throw new Error('idToken is required');
      }
      if (!vpToken) {
        throw new Error('vpToken is required');
      }
    }

    toJSON = (): {
      __type: 'IdAndVpToken';
      id_token: Jwt;
      vp_token: Jwt;
      presentation_submission: object;
    } => ({
      __type: this.__type,
      id_token: this.idToken,
      vp_token: this.vpToken,
      presentation_submission: this.presentationSubmission.serialize(),
    });
  }

  /**
   * Represents a wallet response error.
   * @class WalletResponseError
   * @implements {WalletResponse}
   * @property {string} __type - The type of the wallet response.
   * @property {string} value - The error value.
   * @property {string} [description] - The optional error description.
   */
  export class WalletResponseError implements WalletResponse {
    static schema = z.object({
      __type: z.literal('WalletResponseError'),
      value: z.string().min(1),
      description: z.string().optional(),
    });

    readonly __type = 'WalletResponseError';

    static fromJSON: FromJSON<WalletResponseError> = (json) => {
      const { value, description } = this.schema.parse(json);

      return new WalletResponseError(value, description);
    };

    /**
     * Creates an instance of WalletResponseError.
     * @constructor
     * @param {string} value - The error value.
     * @param {string} [description] - The optional error description.
     */
    constructor(public value: string, public description?: string) {}

    toJSON = (): {
      __type: 'WalletResponseError';
      value: string;
      description: string | undefined;
    } => ({
      __type: this.__type,
      value: this.value,
      description: this.description,
    });
  }
}
