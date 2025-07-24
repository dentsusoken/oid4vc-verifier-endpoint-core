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
import { TransactionId, transactionIdSchema } from './TransactionId';
import { PresentationType, presentationTypeSchema } from './PresentationType';
import { RequestId, requestIdScheme } from './RequestId';
// import {
//   EphemeralECDHPrivateJwk,
//   ephemeralECDHPrivateJwkSchema,
// } from './EphemeralECDHPrivateJwk';
import {
  EphemeralECDHPublicJwk,
  ephemeralECDHPublicJwkSchema,
} from './EphemeralECDHPublicJwk';
import {
  ResponseModeOption,
  responseModeOptionSchema,
} from './ResponseModeOption';
import { EmbedOption, embedOptionSchema } from './EmbedOption';
import {
  GetWalletResponseMethod,
  getWalletResponseMethodSchema,
} from './GetWalletResponseMethod';
import { Nonce, nonceSchema } from './Nonce';
// import { WalletResponse } from './WalletResponse';
import { ResponseCode, responseCodeSchema } from './ResponseCode';
import { iso8601Schema } from './iso8601Schema';
import { FromJSON } from '../common/json/FromJSON';
import { Result, runCatching } from '@vecrea/oid4vc-core/utils';
import {
  AuthorizationResponse,
  authorizationResponseSchema,
} from './AuthorizationResponse';

/**
 * Represents a presentation.
 * @typedef {Presentation.Requested | Presentation.RequestObjectRetrieved | Presentation.Submitted | Presentation.TimedOut} Presentation
 */
export type Presentation =
  | Presentation.Requested
  | Presentation.RequestObjectRetrieved
  | Presentation.Submitted;

/**
 * Schema for the Requested presentation state.
 * @typedef {Object} RequestedSchema
 * @property {string} __type - The type of the presentation state, must be 'Requested'.
 * @property {TransactionIdSchema} id - The transaction ID.
 * @property {ISO8601Schema} initiated_at - The initiation timestamp in ISO 8601 format.
 * @property {PresentationTypeSchema} type - The type of the presentation.
 * @property {RequestIdSchema} request_id - The request ID.
 * @property {NonceSchema} nonce - The nonce value.
 * @property {EphemeralECDHPrivateJwkSchema} [ephemeral_ecdh_private_jwk] - The ephemeral ECDH private key in JWK format (optional).
 * @property {ResponseModeOptionSchema} response_mode - The response mode option.
 * @property {EmbedOptionSchema} presentation_definition_mode - The presentation definition mode.
 * @property {GetWalletResponseMethodSchema} get_wallet_response_method - The method to get the wallet response.
 */
const requestedSchema = z.object({
  __type: z.literal('Requested'),
  id: transactionIdSchema,
  initiated_at: iso8601Schema,
  type: presentationTypeSchema,
  request_id: requestIdScheme,
  nonce: nonceSchema,
  ephemeral_ecdh_public_jwk: z.optional(ephemeralECDHPublicJwkSchema),
  response_mode: responseModeOptionSchema,
  presentation_definition_mode: embedOptionSchema,
  get_wallet_response_method: getWalletResponseMethodSchema,
});

/**
 * Schema for the RequestObjectRetrieved presentation state.
 * @typedef {Object} RequestObjectRetrievedSchema
 * @property {string} __type - The type of the presentation state, must be 'RequestObjectRetrieved'.
 * @property {TransactionIdSchema} id - The transaction ID.
 * @property {ISO8601Schema} initiated_at - The initiation timestamp in ISO 8601 format.
 * @property {PresentationTypeSchema} type - The type of the presentation.
 * @property {RequestIdSchema} request_id - The request ID.
 * @property {ISO8601Schema} request_object_retrieved_at - The timestamp when the request object was retrieved, in ISO 8601 format.
 * @property {NonceSchema} nonce - The nonce value.
 * @property {EphemeralECDHPrivateJwkSchema} [ephemeral_ecdh_private_jwk] - The ephemeral ECDH private key in JWK format (optional).
 * @property {ResponseModeOptionSchema} response_mode - The response mode option.
 * @property {GetWalletResponseMethodSchema} get_wallet_response_method - The method to get the wallet response.
 */
const requestObjectRetrievedSchema = z.object({
  __type: z.literal('RequestObjectRetrieved'),
  id: transactionIdSchema,
  initiated_at: iso8601Schema,
  type: presentationTypeSchema,
  request_id: requestIdScheme,
  request_object_retrieved_at: iso8601Schema,
  nonce: nonceSchema,
  ephemeral_ecdh_public_jwk: z.optional(ephemeralECDHPublicJwkSchema),
  response_mode: responseModeOptionSchema,
  get_wallet_response_method: getWalletResponseMethodSchema,
});

/**
 * Schema for the Submitted presentation state.
 * @typedef {Object} SubmittedSchema
 * @property {string} __type - The type of the presentation state, must be 'Submitted'.
 * @property {TransactionIdSchema} id - The transaction ID.
 * @property {ISO8601Schema} initiated_at - The initiation timestamp in ISO 8601 format.
 * @property {PresentationTypeSchema} type - The type of the presentation.
 * @property {RequestIdSchema} request_id - The request ID.
 * @property {ISO8601Schema} request_object_retrieved_at - The timestamp when the request object was retrieved, in ISO 8601 format.
 * @property {ISO8601Schema} submitted_at - The timestamp when the presentation was submitted, in ISO 8601 format.
 * @property {WalletResponseSchema} wallet_response - The wallet response.
 * @property {NonceSchema} nonce - The nonce value.
 * @property {ResponseCodeSchema} [response_code] - The response code (optional).
 */
const submittedSchema = z.object({
  __type: z.literal('Submitted'),
  id: transactionIdSchema,
  initiated_at: iso8601Schema,
  type: presentationTypeSchema,
  request_id: requestIdScheme,
  request_object_retrieved_at: iso8601Schema,
  submitted_at: iso8601Schema,
  wallet_response: authorizationResponseSchema,
  nonce: nonceSchema,
  response_code: z.optional(responseCodeSchema),
});

/**
 * Schema for the Presentation state, representing different stages of the presentation process.
 * @typedef {Object} PresentationSchema
 * @property {string} __type - Discriminator property to determine the specific presentation state.
 * @description This schema uses a discriminated union to represent three possible states of a presentation:
 * 'Requested', 'RequestObjectRetrieved', and 'Submitted'. The '__type' property determines which specific
 * schema is used for validation.
 *
 * Possible values for __type:
 * - 'Requested': Initial state when a presentation is requested.
 * - 'RequestObjectRetrieved': State after the request object has been retrieved.
 * - 'Submitted': Final state after the presentation has been submitted.
 *
 * @see {RequestedSchema} For the structure of the 'Requested' state.
 * @see {RequestObjectRetrievedSchema} For the structure of the 'RequestObjectRetrieved' state.
 * @see {SubmittedSchema} For the structure of the 'Submitted' state.
 */
export const presentationSchema = z.discriminatedUnion('__type', [
  requestedSchema,
  requestObjectRetrievedSchema,
  submittedSchema,
]);

/**
 * JSON representation of a Presentation object.
 * @typedef {Object} PresentationJSON
 * @description This type represents the JSON structure of a Presentation object, inferred from the presentationSchema.
 * It can be one of three types: Requested, RequestObjectRetrieved, or Submitted, determined by the '__type' property.
 *
 * @property {string} __type - Discriminator property. Possible values: 'Requested', 'RequestObjectRetrieved', or 'Submitted'.
 * @property {string} id - The transaction ID.
 * @property {string} initiated_at - The initiation timestamp in ISO 8601 format.
 * @property {Object} type - The type of the presentation.
 * @property {string} request_id - The request ID.
 * @property {string} nonce - The nonce value.
 *
 * @property {string} [request_object_retrieved_at] - The timestamp when the request object was retrieved (for RequestObjectRetrieved and Submitted types).
 * @property {string} [submitted_at] - The timestamp when the presentation was submitted (for Submitted type only).
 * @property {Object} [wallet_response] - The wallet response (for Submitted type only).
 * @property {string} [response_code] - The response code (for Submitted type only, optional).
 *
 * @property {string} [ephemeral_ecdh_private_jwk] - The ephemeral ECDH private key in JWK format (for Requested and RequestObjectRetrieved types, optional).
 * @property {string} [response_mode] - The response mode option (for Requested and RequestObjectRetrieved types).
 * @property {Object} [presentation_definition_mode] - The presentation definition mode (for Requested type only).
 * @property {Object} [get_wallet_response_method] - The method to get the wallet response (for Requested and RequestObjectRetrieved types).
 */
export type PresentationJSON = z.infer<typeof presentationSchema>;

/**
 * Namespace containing types and functions related to Presentations.
 * @namespace Presentation
 * @description This namespace encapsulates all the functionality and types related to the Presentation process.
 * It includes different states of a Presentation (Requested, RequestObjectRetrieved, Submitted) and utility functions
 * for handling these states.
 *
 * The Presentation process typically follows this flow:
 * 1. Requested: Initial state when a presentation is requested.
 * 2. RequestObjectRetrieved: State after the request object has been retrieved.
 * 3. Submitted: Final state after the presentation has been submitted.
 *
 * Each state is represented by a corresponding class within this namespace, and there are utility
 * functions for converting between JSON representations and class instances.
 *
 * @example
 * // Creating a new Requested presentation
 * const requested = new Presentation.Requested(...);
 *
 * // Converting a Presentation to JSON
 * const json = requested.toJSON();
 *
 * // Creating a Presentation instance from JSON
 * const presentation = Presentation.fromJSON(json);
 */
export namespace Presentation {
  /**
   * JSON representation of a Requested presentation state.
   * @typedef {Object} RequestedJSON
   */
  export type RequestedJSON = z.infer<typeof requestedSchema>;

  /**
   * JSON representation of a RequestObjectRetrieved presentation state.
   * @typedef {Object} RequestObjectRetrievedJSON
   */
  export type RequestObjectRetrievedJSON = z.infer<
    typeof requestObjectRetrievedSchema
  >;

  /**
   * JSON representation of a Submitted presentation state.
   * @typedef {Object} SubmittedJSON
   */
  export type SubmittedJSON = z.infer<typeof submittedSchema>;

  /**
   * Creates a Presentation instance from its JSON representation.
   * @function fromJSON
   * @param {PresentationJSON} json - The JSON representation of the Presentation.
   * @returns {Presentation} The corresponding Presentation instance.
   * @throws {Error} If the __type property is not recognized.
   *
   * @example
   * const json = {
   *   __type: 'Requested',
   *   // ... other properties
   * };
   * const presentation = Presentation.fromJSON(json);
   */
  export const fromJSON: FromJSON<PresentationJSON, Presentation> = (json) => {
    switch (json.__type) {
      case 'Requested':
        return Requested.fromJSON(json);
      case 'RequestObjectRetrieved':
        return RequestObjectRetrieved.fromJSON(json);
      case 'Submitted':
        return Submitted.fromJSON(json);
    }
  };

  /**
   * Interface representing a presentation.
   * @interface Presentation
   */
  interface Base {
    /**
     * The type of the presentation.
     * @type {('Requested' | 'RequestObjectRetrieved' | 'Submitted' | 'TimedOut')}
     * @readonly
     */
    readonly __type: 'Requested' | 'RequestObjectRetrieved' | 'Submitted';

    /**
     * The transaction ID.
     * @type {TransactionId}
     */
    id: TransactionId;

    /**
     * The initiation date and time.
     * @type {Date}
     */
    initiatedAt: Date;

    /**
     * The presentation type.
     * @type {PresentationType}
     */
    type: PresentationType;

    /**
     * Converts the Presentation instance to its JSON representation.
     * @returns {PresentationJSON} The JSON representation of the Presentation.
     * @description This method serializes the Presentation instance into a JSON object
     * that conforms to the PresentationJSON type. The specific structure of the returned
     * JSON object depends on the __type of the Presentation (Requested, RequestObjectRetrieved, or Submitted).
     *
     * @example
     * const presentation = new Presentation.Requested(...);
     * const json = presentation.toJSON();
     * console.log(json); // { __type: 'Requested', ... }
     */
    toJSON(): PresentationJSON;
  }

  /**
   * Represents a requested presentation.
   * @class Requested
   * @implements {Base}
   */
  export class Requested implements Base {
    /**
     * The type of the presentation.
     * @type {('Requested')}
     * @readonly
     */
    readonly __type = 'Requested' as const;

    /**
     * Creates a Requested instance from its JSON representation.
     * @static
     * @param {RequestedJSON} json - The JSON representation of the Requested presentation state.
     * @returns {Requested} A new Requested instance.
     * @throws {Error} If the JSON is invalid or missing required properties.
     *
     * @example
     * const json = {
     *   __type: 'Requested',
     *   id: 'transaction-id',
     *   initiated_at: '2023-06-08T10:00:00Z',
     *   // ... other properties
     * };
     * const requested = Requested.fromJSON(json);
     */
    static fromJSON: FromJSON<RequestedJSON, Requested> = (json) =>
      new Requested(
        new TransactionId(json.id),
        new Date(json.initiated_at),
        PresentationType.fromJSON(json.type),
        new RequestId(json.request_id),
        new Nonce(json.nonce),
        json.ephemeral_ecdh_public_jwk
          ? new EphemeralECDHPublicJwk(json.ephemeral_ecdh_public_jwk)
          : undefined,
        json.response_mode,
        EmbedOption.fromJSON(json.presentation_definition_mode),
        GetWalletResponseMethod.fromJSON(json.get_wallet_response_method)
      );
    /**
     * Constructorq
     * @param id Transaction ID
     * @param initiatedAt Initiation date and time
     * @param type Presentation type
     * @param requestId Request ID
     * @param nonce Nonce
     * @param ephemeralECDHPrivateJwk Ephemeral ECDH private key in JWK format
     * @param responseMode Response mode option
     * @param presentationDefinitionMode Presentation definition mode option with request ID
     * @param getWalletResponseMethod Method to get wallet response
     */
    constructor(
      public id: TransactionId,
      public initiatedAt: Date,
      public type: PresentationType,
      public requestId: RequestId,
      public nonce: Nonce,
      public ephemeralECDHPublicJwk: EphemeralECDHPublicJwk | undefined,
      public responseMode: ResponseModeOption,
      public presentationDefinitionMode: EmbedOption,
      public getWalletResponseMethod: GetWalletResponseMethod
    ) {}

    /**
     * Retrieves the request object.
     * @param {Date} at - The retrieval date and time.
     * @returns {Result} The result containing the retrieved request object.
     */
    retrieveRequestObject(at: Date): Result<RequestObjectRetrieved> {
      return runCatching(
        () =>
          new RequestObjectRetrieved(
            this.id,
            this.initiatedAt,
            this.type,
            this.requestId,
            at,
            this.nonce,
            this.ephemeralECDHPublicJwk,
            this.responseMode,
            this.getWalletResponseMethod
          )
      );
    }

    /**
     * Converts the Requested instance to its JSON representation.
     * @returns {RequestedJSON} The JSON representation of the Requested presentation state.
     *
     * @example
     * const requested = new Requested(...);
     * const json = requested.toJSON();
     * console.log(json);
     * // {
     * //   __type: 'Requested',
     * //   id: 'transaction-id',
     * //   initiated_at: '2023-06-08T10:00:00.000Z',
     * //   ... other properties
     * // }
     */
    toJSON(): RequestedJSON {
      const json: RequestedJSON = {
        __type: 'Requested',
        id: this.id.toJSON(),
        initiated_at: this.initiatedAt.toJSON(),
        type: this.type.toJSON(),
        request_id: this.requestId.toJSON(),
        nonce: this.nonce.toJSON(),
        response_mode: this.responseMode,
        presentation_definition_mode: this.presentationDefinitionMode.toJSON(),
        get_wallet_response_method: this.getWalletResponseMethod.toJSON(),
      };

      if (this.ephemeralECDHPublicJwk) {
        json.ephemeral_ecdh_public_jwk = this.ephemeralECDHPublicJwk.toJSON();
      }

      return json;
    }
  }

  /**
   * Represents a request object retrieved presentation.
   * @class RequestObjectRetrieved
   * @implements {Base}
   */
  export class RequestObjectRetrieved implements Base {
    /**
     * The type of the presentation.
     * @type {('RequestObjectRetrieved')}
     * @readonly
     */
    readonly __type = 'RequestObjectRetrieved' as const;

    /**
     * Creates a RequestObjectRetrieved instance from its JSON representation.
     * @static
     * @param {RequestObjectRetrievedJSON} json - The JSON representation of the RequestObjectRetrieved presentation state.
     * @returns {RequestObjectRetrieved} A new RequestObjectRetrieved instance.
     * @throws {Error} If the JSON is invalid or missing required properties.
     *
     * @example
     * const json = {
     *   __type: 'RequestObjectRetrieved',
     *   id: 'transaction-id',
     *   initiated_at: '2023-06-08T10:00:00Z',
     *   request_object_retrieved_at: '2023-06-08T10:05:00Z',
     *   // ... other properties
     * };
     * const requestObjectRetrieved = RequestObjectRetrieved.fromJSON(json);
     */
    static fromJSON: FromJSON<
      RequestObjectRetrievedJSON,
      RequestObjectRetrieved
    > = (json) =>
      new RequestObjectRetrieved(
        new TransactionId(json.id),
        new Date(json.initiated_at),
        PresentationType.fromJSON(json.type),
        new RequestId(json.request_id),
        new Date(json.request_object_retrieved_at),
        new Nonce(json.nonce),
        json.ephemeral_ecdh_public_jwk
          ? new EphemeralECDHPublicJwk(json.ephemeral_ecdh_public_jwk)
          : undefined,
        json.response_mode,
        GetWalletResponseMethod.fromJSON(json.get_wallet_response_method)
      );

    /**
     * Creates an instance of RequestObjectRetrieved.
     * @param {TransactionId} id - The transaction ID.
     * @param {Date} initiatedAt - The initiation date and time.
     * @param {PresentationType} type - The presentation type.
     * @param {RequestId} requestId - The request ID.
     * @param {Date} requestObjectRetrievedAt - The request object retrieval date and time.
     * @param {Nonce} nonce - The nonce.
     * @param {EphemeralECDHPrivateJwk | undefined} ephemeralECDHPrivateJwk - The ephemeral EC private key in JWK format.
     * @param {ResponseModeOption} responseMode - The response mode option.
     * @param {GetWalletResponseMethod} getWalletResponseMethod - The method to get wallet response.
     */
    constructor(
      public id: TransactionId,
      public initiatedAt: Date,
      public type: PresentationType,
      public requestId: RequestId,
      public requestObjectRetrievedAt: Date,
      public nonce: Nonce,
      public ephemeralECDHPublicJwk: EphemeralECDHPublicJwk | undefined,
      public responseMode: ResponseModeOption,
      public getWalletResponseMethod: GetWalletResponseMethod
    ) {
      const initiatedAtEpoc = initiatedAt.getTime();
      const requestObjectRetrievedAtEpoc = requestObjectRetrievedAt.getTime();

      if (initiatedAtEpoc > requestObjectRetrievedAtEpoc) {
        throw new Error(
          'initiatedAt must be earlier than requestObjectRetrievedAt or equal to requestObjectRetrievedAtEpoc'
        );
      }
    }

    /**
     * Submits the presentation.
     * @param {Date} at - The submission date and time.
     * @param {WalletResponse} walletResponse - The wallet response.
     * @param {ResponseCode | undefined} responseCode - The response code.
     * @returns {Result} The result containing the submitted presentation.
     */
    submit(
      at: Date,
      walletResponse: AuthorizationResponse,
      responseCode: ResponseCode | undefined
    ): Result<Presentation.Submitted> {
      return runCatching(
        () =>
          new Presentation.Submitted(
            this.id,
            this.initiatedAt,
            this.type,
            this.requestId,
            this.requestObjectRetrievedAt,
            at,
            walletResponse,
            this.nonce,
            responseCode
          )
      );
    }

    /**
     * Converts the RequestObjectRetrieved instance to its JSON representation.
     * @returns {RequestObjectRetrievedJSON} The JSON representation of the RequestObjectRetrieved presentation state.
     *
     * @example
     * const requestObjectRetrieved = new RequestObjectRetrieved(...);
     * const json = requestObjectRetrieved.toJSON();
     * console.log(json);
     * // {
     * //   __type: 'RequestObjectRetrieved',
     * //   id: 'transaction-id',
     * //   initiated_at: '2023-06-08T10:00:00.000Z',
     * //   request_object_retrieved_at: '2023-06-08T10:05:00.000Z',
     * //   ... other properties
     * // }
     */
    toJSON(): RequestObjectRetrievedJSON {
      const json: RequestObjectRetrievedJSON = {
        __type: 'RequestObjectRetrieved',
        id: this.id.toJSON(),
        initiated_at: this.initiatedAt.toJSON(),
        type: this.type.toJSON(),
        request_id: this.requestId.toJSON(),
        request_object_retrieved_at: this.requestObjectRetrievedAt.toJSON(),
        nonce: this.nonce.toJSON(),
        response_mode: this.responseMode,
        get_wallet_response_method: this.getWalletResponseMethod.toJSON(),
      };

      if (this.ephemeralECDHPublicJwk) {
        json.ephemeral_ecdh_public_jwk = this.ephemeralECDHPublicJwk.toJSON();
      }

      return json;
    }
  }

  /**
   * Represents a submitted presentation.
   * @class Submitted
   * @implements {Base}
   */
  export class Submitted implements Base {
    /**
     * The type of the presentation.
     * @type {('Submitted')}
     * @readonly
     */
    readonly __type = 'Submitted';

    /**
     * Creates a Submitted instance from its JSON representation.
     * @static
     * @param {SubmittedJSON} json - The JSON representation of the Submitted presentation state.
     * @returns {Submitted} A new Submitted instance.
     * @throws {Error} If the JSON is invalid or missing required properties.
     *
     * @example
     * const json = {
     *   __type: 'Submitted',
     *   id: 'transaction-id',
     *   initiated_at: '2023-06-08T10:00:00Z',
     *   request_object_retrieved_at: '2023-06-08T10:05:00Z',
     *   submitted_at: '2023-06-08T10:10:00Z',
     *   wallet_response: { ... },
     *   // ... other properties
     * };
     * const submitted = Submitted.fromJSON(json);
     */
    static fromJSON: FromJSON<SubmittedJSON, Submitted> = (json) =>
      new Submitted(
        new TransactionId(json.id),
        new Date(json.initiated_at),
        PresentationType.fromJSON(json.type),
        new RequestId(json.request_id),
        new Date(json.request_object_retrieved_at),
        new Date(json.submitted_at),
        AuthorizationResponse.fromJSON(json.wallet_response),
        new Nonce(json.nonce),
        json.response_code ? new ResponseCode(json.response_code) : undefined
      );

    /**
     * Creates an instance of Submitted.
     * @param {TransactionId} id - The transaction ID.
     * @param {Date} initiatedAt - The initiation date and time.
     * @param {PresentationType} type - The presentation type.
     * @param {RequestId} requestId - The request ID.
     * @param {Date} requestObjectRetrievedAt - The request object retrieval date and time.
     * @param {Date} submittedAt - The submission date and time.
     * @param {AuthorizationResponse} walletResponse - The wallet response.
     * @param {Nonce} nonce - The nonce.
     * @param {ResponseCode | undefined} responseCode - The response code.
     */
    constructor(
      public id: TransactionId,
      public initiatedAt: Date,
      public type: PresentationType,
      public requestId: RequestId,
      public requestObjectRetrievedAt: Date,
      public submittedAt: Date,
      public walletResponse: AuthorizationResponse,
      public nonce: Nonce,
      public responseCode: ResponseCode | undefined
    ) {
      const initiatedAtEpoc = initiatedAt.getTime();
      const now = Date.now();

      if (initiatedAtEpoc > now) {
        throw new Error('initiatedAt must be earlier than now');
      }
    }

    /**
     * Converts the Submitted instance to its JSON representation.
     * @returns {SubmittedJSON} The JSON representation of the Submitted presentation state.
     *
     * @example
     * const submitted = new Submitted(...);
     * const json = submitted.toJSON();
     * console.log(json);
     * // {
     * //   __type: 'Submitted',
     * //   id: 'transaction-id',
     * //   initiated_at: '2023-06-08T10:00:00.000Z',
     * //   request_object_retrieved_at: '2023-06-08T10:05:00.000Z',
     * //   submitted_at: '2023-06-08T10:10:00.000Z',
     * //   wallet_response: { ... },
     * //   ... other properties
     * // }
     */
    toJSON(): SubmittedJSON {
      const json: SubmittedJSON = {
        __type: 'Submitted',
        id: this.id.toJSON(),
        initiated_at: this.initiatedAt.toJSON(),
        type: this.type.toJSON(),
        request_id: this.requestId.toJSON(),
        request_object_retrieved_at: this.requestObjectRetrievedAt.toJSON(),
        submitted_at: this.submittedAt.toJSON(),
        wallet_response: this.walletResponse.toJSON(),
        nonce: this.nonce.toJSON(),
      };

      if (this.responseCode) {
        json.response_code = this.responseCode.toJSON();
      }

      return json;
    }
  }
}
