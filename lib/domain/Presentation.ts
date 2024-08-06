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
 * Presentation interface
 */
export interface Presentation {
  /** Transaction ID */
  id: TransactionId;
  /** Initiation date and time */
  initiatedAt: Date;
  /** Presentation type */
  type: PresentationType;
  /**
   * Check if the presentation is expired at the specified date and time
   * @param at Date and time to check
   * @returns true if expired, false otherwise
   */
  isExpired(at: Date): boolean;
}

export namespace PresentationNS {
  /**
   * Requested presentation class
   */
  /**
   * Requested presentation class
   */
  export class Requested implements Presentation {
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
     * Check if the presentation is expired at the specified date and time
     * @param at Date and time to check
     * @returns true if expired, false otherwise
     */
    isExpired(at: Date): boolean {
      const initiatedAtEpoc = this.initiatedAt.getTime();
      const atEpoc = at.getTime();
      return initiatedAtEpoc <= atEpoc;
    }

    /**
     * Retrieve the request object
     * @param at Retrieval date and time
     * @returns Result containing the retrieved request object
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
     * Timeout processing
     * @param at Timeout date and time
     * @returns Result containing the timed out presentation
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
   * Request object retrieved presentation class
   */
  export class RequestObjectRetrieved implements Presentation {
    /**
     * Constructor
     * @param id Transaction ID
     * @param initiatedAt Initiation date and time
     * @param type Presentation type
     * @param requestId Request ID
     * @param requestObjectRetrievedAt Request object retrieval date and time
     * @param nonce Nonce
     * @param ephemeralEcPrivateKey Ephemeral EC private key in JWK format
     * @param responseMode Response mode option
     * @param getWalletResponseMethod Method to get wallet response
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
     * Check if the presentation is expired at the specified date and time
     * @param at Date and time to check
     * @returns true if expired, false otherwise
     */
    isExpired(at: Date): boolean {
      const requestObjectRetrievedAtEpoc =
        this.requestObjectRetrievedAt.getTime();
      const atEpoc = at.getTime();
      return requestObjectRetrievedAtEpoc <= atEpoc;
    }

    /**
     * Submit the presentation
     * @param at Submission date and time
     * @param walletResponse Wallet response
     * @param responseCode Response code
     * @returns Result containing the submitted presentation
     */
    submit(
      at: Date,
      walletResponse: WalletResponse,
      responseCode: ResponseCode | undefined
    ): Result<PresentationNS.Submitted> {
      return runCatching(
        () =>
          new PresentationNS.Submitted(
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
     * Timeout processing
     * @param at Timeout date and time
     * @returns Result containing the timed out presentation
     */
    timedOut(at: Date): Result<PresentationNS.TimedOut> {
      return runCatching(() => {
        const initiatedAtEpoc = this.initiatedAt.getTime();
        const atEpoc = at.getTime();

        if (initiatedAtEpoc > atEpoc) {
          throw new Error('initiatedAt must be earlier than at');
        }
        return new PresentationNS.TimedOut(
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
   * Submitted presentation class
   */
  export class Submitted implements Presentation {
    /**
     * Constructor
     * @param id Transaction ID
     * @param initiatedAt Initiation date and time
     * @param type Presentation type
     * @param requestId Request ID
     * @param requestObjectRetrievedAt Request object retrieval date and time
     * @param submittedAt Submission date and time
     * @param walletResponse Wallet response
     * @param nonce Nonce
     * @param responseCode Response code
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
     * Check if the presentation is expired at the specified date and time
     * @param at Date and time to check
     * @returns true if expired, false otherwise
     */
    isExpired(at: Date): boolean {
      const initiatedAtEpoc = this.initiatedAt.getTime();
      const atEpoc = at.getTime();
      return initiatedAtEpoc <= atEpoc;
    }

    /**
     * Timeout processing
     * @param at Timeout date and time
     * @returns Result containing the timed out presentation
     */
    timedOut(at: Date): Result<PresentationNS.TimedOut> {
      return runCatching(() => {
        const initiatedAtEpoc = this.initiatedAt.getTime();
        const atEpoc = at.getTime();

        if (initiatedAtEpoc > atEpoc) {
          throw new Error('initiatedAt must be earlier than at');
        }

        return new PresentationNS.TimedOut(
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
   * Timed out presentation class
   */
  export class TimedOut implements Presentation {
    /**
     * Constructor
     * @param id Transaction ID
     * @param initiatedAt Initiation date and time
     * @param type Presentation type
     * @param requestObjectRetrievedAt Request object retrieval date and time
     * @param submittedAt Submission date and time
     * @param timedOutAt Timeout date and time
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
     * Check if the presentation is expired at the specified date and time
     * @param _ Date and time to check (unused)
     * @returns Always returns false
     */
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    isExpired(_: Date): boolean {
      return false;
    }
  }
}
