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
import { Result, runCatching } from '../kotlin';

/**
 * Represents a presentation.
 * @typedef {Presentation.Requested | Presentation.RequestObjectRetrieved | Presentation.Submitted | Presentation.TimedOut} Presentation
 */
export type Presentation =
  | Presentation.Requested
  | Presentation.RequestObjectRetrieved
  | Presentation.Submitted
  | Presentation.TimedOut;

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
    readonly __type:
      | 'Requested'
      | 'RequestObjectRetrieved'
      | 'Submitted'
      | 'TimedOut';

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
     * Checks if the presentation is expired at the specified date and time.
     * @param {Date} at - The date and time to check.
     * @returns {boolean} True if expired, false otherwise.
     */
    isExpired(at: Date): boolean;
  }

  /**
   * Represents a requested presentation.
   * @class Requested
   * @implements {Presentation}
   */
  export class Requested implements Presentation {
    readonly __type = 'Requested';
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
      public presentationDefinitionMode: EmbedOption<RequestId> | undefined,
      public getWalletResponseMethod: GetWalletResponseMethod
    ) {}

    /**
     * Checks if the presentation is expired at the specified date and time.
     * @param {Date} at - The date and time to check.
     * @returns {boolean} True if expired, false otherwise.
     */
    isExpired(at: Date): boolean {
      const initiatedAtEpoc = this.initiatedAt.getTime();
      const atEpoc = at.getTime();
      return initiatedAtEpoc <= atEpoc;
    }

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

    /**
     * Performs timeout processing.
     * @param {Date} at - The timeout date and time.
     * @returns {Result} The result containing the timed out presentation.
     */
    timedOut(at: Date): Result<TimedOut> {
      return runCatching(() => {
        const initiatedAtEpoc = this.initiatedAt.getTime();
        const atEpoc = at.getTime();

        if (initiatedAtEpoc > atEpoc) {
          throw new Error('initiatedAt must be earlier than at');
        }

        return new TimedOut(
          this.id,
          this.initiatedAt,
          this.type,
          undefined,
          undefined,
          at
        );
      });
    }
  }

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
     * @param {EphemeralECDHPrivateJwk | undefined} ephemeralEcPrivateKey - The ephemeral EC private key in JWK format.
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
      public ephemeralEcPrivateKey: EphemeralECDHPrivateJwk | undefined,
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
     * Checks if the presentation is expired at the specified date and time.
     * @param {Date} at - The date and time to check.
     * @returns {boolean} True if expired, false otherwise.
     */
    isExpired(at: Date): boolean {
      const requestObjectRetrievedAtEpoc =
        this.requestObjectRetrievedAt.getTime();
      const atEpoc = at.getTime();
      return requestObjectRetrievedAtEpoc <= atEpoc;
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

    /**
     * Performs timeout processing.
     * @param {Date} at - The timeout date and time.
     * @returns {Result} The result containing the timed out presentation.
     */
    timedOut(at: Date): Result<Presentation.TimedOut> {
      return runCatching(() => {
        const initiatedAtEpoc = this.initiatedAt.getTime();
        const atEpoc = at.getTime();

        if (initiatedAtEpoc > atEpoc) {
          throw new Error('initiatedAt must be earlier than at');
        }
        return new Presentation.TimedOut(
          this.id,
          this.initiatedAt,
          this.type,
          this.requestObjectRetrievedAt,
          undefined,
          at
        );
      });
    }
  }

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

    /**
     * Checks if the presentation is expired at the specified date and time.
     * @param {Date} at - The date and time to check.
     * @returns {boolean} True if expired, false otherwise.
     */
    isExpired(at: Date): boolean {
      const initiatedAtEpoc = this.initiatedAt.getTime();
      const atEpoc = at.getTime();
      return initiatedAtEpoc <= atEpoc;
    }

    /**
     * Performs timeout processing.
     * @param {Date} at - The timeout date and time.
     * @returns {Result} The result containing the timed out presentation.
     */
    timedOut(at: Date): Result<Presentation.TimedOut> {
      return runCatching(() => {
        const initiatedAtEpoc = this.initiatedAt.getTime();
        const atEpoc = at.getTime();

        if (initiatedAtEpoc > atEpoc) {
          throw new Error('initiatedAt must be earlier than at');
        }

        return new Presentation.TimedOut(
          this.id,
          this.initiatedAt,
          this.type,
          this.requestObjectRetrievedAt,
          this.submittedAt,
          at
        );
      });
    }
  }

  /**
   * Represents a timed out presentation.
   * @class TimedOut
   * @implements {Presentation}
   */
  export class TimedOut implements Presentation {
    /**
     * The type of the presentation.
     * @type {('TimedOut')}
     * @readonly
     */
    readonly __type = 'TimedOut';
    /**
     * Creates an instance of TimedOut.
     * @param {TransactionId} id - The transaction ID.
     * @param {Date} initiatedAt - The initiation date and time.
     * @param {PresentationType} type - The presentation type.
     * @param {Date | undefined} [requestObjectRetrievedAt=undefined] - The request object retrieval date and time.
     * @param {Date | undefined} [submittedAt=undefined] - The submission date and time.
     * @param {Date} timedOutAt - The timeout date and time.
     */
    constructor(
      public id: TransactionId,
      public initiatedAt: Date,
      public type: PresentationType,
      public requestObjectRetrievedAt: Date | undefined = undefined,
      public submittedAt: Date | undefined = undefined,
      public timedOutAt: Date
    ) {}

    /**
     * Checks if the presentation is expired at the specified date and time.
     * @param {Date} _ - The date and time to check (unused).
     * @returns {boolean} Always returns false.
     */
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    isExpired(_: Date): boolean {
      return false;
    }
  }
}
