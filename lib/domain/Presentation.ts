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
import {
  TransactionId,
  PresentationType,
  RequestId,
  EphemeralECDHPrivateJwk,
  ResponseModeOption,
  EmbedOption,
  GetWalletResponseMethod,
  Nonce,
  WalletResponse,
  ResponseCode,
} from '.';
//import { FromJSON } from '../common/json/FromJSON';
import { Result, runCatching } from '../kotlin';

/**
 * Represents a presentation.
 * @typedef {Presentation.Requested | Presentation.RequestObjectRetrieved | Presentation.Submitted | Presentation.TimedOut} Presentation
 */
export type Presentation =
  | Presentation.Requested
  | Presentation.RequestObjectRetrieved
  | Presentation.Submitted;

export namespace Presentation {
  /**
   * Interface representing a presentation.
   * @interface Presentation
   */
  export interface Presentation {
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
  }

  type RequestedJSONType = {
    id: string;
    initiated_at: string;
    type: object;
    request_id: string;
    nonce: string;
    ephemeral_ecdh_private_jwk?: string;
    response_mode: string;
    get_wallet_response_method: GetWalletResponseMethod.GetWalletResponseMethodJSONType;
  };

  /**
   * Represents a requested presentation.
   * @class Requested
   * @implements {Presentation}
   */
  export class Requested implements Presentation {
    readonly __type = 'Requested';

    // static fromJSON: FromJSON<Requested> = (json) => {

    // }
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
      public ephemeralECDHPrivateJwk: EphemeralECDHPrivateJwk | undefined,
      public responseMode: ResponseModeOption,
      public presentationDefinitionMode: EmbedOption<RequestId>,
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
            this.ephemeralECDHPrivateJwk,
            this.responseMode,
            this.getWalletResponseMethod
          )
      );
    }

    toJSON(): RequestedJSONType {
      const json: RequestedJSONType = {
        id: this.id.toJSON(),
        initiated_at: this.initiatedAt.toJSON(),
        type: this.type.toJSON(),
        request_id: this.requestId.toJSON(),
        nonce: this.nonce.toJSON(),
        response_mode: ResponseModeOption.toJSON(this.responseMode),
        get_wallet_response_method: this.getWalletResponseMethod.toJSON(),
      };

      if (this.ephemeralECDHPrivateJwk) {
        json.ephemeral_ecdh_private_jwk = EphemeralECDHPrivateJwk.toJSON(
          this.ephemeralECDHPrivateJwk
        );
      }

      return json;
    }
  }

  type RequestObjectRetrievedJSONType = {
    id: string;
    initiated_at: string;
    type: object;
    request_id: string;
    request_object_retrieved_at: string;
    nonce: string;
    ephemeral_ecdh_private_jwk?: string;
    response_mode: string;
    get_wallet_response_method: GetWalletResponseMethod.GetWalletResponseMethodJSONType;
  };

  /**
   * Represents a request object retrieved presentation.
   * @class RequestObjectRetrieved
   * @implements {Presentation}
   */
  export class RequestObjectRetrieved implements Presentation {
    /**
     * The type of the presentation.
     * @type {('RequestObjectRetrieved')}
     * @readonly
     */
    readonly __type = 'RequestObjectRetrieved';

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
      public ephemeralECDHPrivateJwk: EphemeralECDHPrivateJwk | undefined,
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
      walletResponse: WalletResponse,
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

    toJSON(): RequestObjectRetrievedJSONType {
      const json: RequestObjectRetrievedJSONType = {
        id: this.id.toJSON(),
        initiated_at: this.initiatedAt.toJSON(),
        type: this.type.toJSON(),
        request_id: this.requestId.toJSON(),
        request_object_retrieved_at: this.requestObjectRetrievedAt.toJSON(),
        nonce: this.nonce.toJSON(),
        response_mode: ResponseModeOption.toJSON(this.responseMode),
        get_wallet_response_method: this.getWalletResponseMethod.toJSON(),
      };

      if (this.ephemeralECDHPrivateJwk) {
        json.ephemeral_ecdh_private_jwk = EphemeralECDHPrivateJwk.toJSON(
          this.ephemeralECDHPrivateJwk
        );
      }

      return json;
    }
  }

  type SubmittedJSONType = {
    id: string;
    initiated_at: string;
    type: object;
    request_id: string;
    request_object_retrieved_at: string;
    submitted_at: string;
    wallet_response: WalletResponse.WalletResponseJSONType;
    nonce: string;
    response_code?: string;
  };

  /**
   * Represents a submitted presentation.
   * @class Submitted
   * @implements {Presentation}
   */
  export class Submitted implements Presentation {
    /**
     * The type of the presentation.
     * @type {('Submitted')}
     * @readonly
     */
    readonly __type = 'Submitted';

    /**
     * Creates an instance of Submitted.
     * @param {TransactionId} id - The transaction ID.
     * @param {Date} initiatedAt - The initiation date and time.
     * @param {PresentationType} type - The presentation type.
     * @param {RequestId} requestId - The request ID.
     * @param {Date} requestObjectRetrievedAt - The request object retrieval date and time.
     * @param {Date} submittedAt - The submission date and time.
     * @param {WalletResponse} walletResponse - The wallet response.
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
      public walletResponse: WalletResponse,
      public nonce: Nonce,
      public responseCode: ResponseCode | undefined
    ) {
      const initiatedAtEpoc = initiatedAt.getTime();
      const now = Date.now();

      if (initiatedAtEpoc > now) {
        throw new Error('initiatedAt must be earlier than now');
      }
    }

    toJSON(): SubmittedJSONType {
      const json: SubmittedJSONType = {
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
        json.response_code = this.responseCode?.toJSON();
      }

      return json;
    }
  }
}
