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
import { Result, runCatching } from '..';
import { PresentationDefinition } from '../../mock/prex/PresentationDefinition';
import { PresentationSubmission } from '../../mock/prex/PresentationSubmission';
import { EmbedOption, ResponseModeOption } from './VerifierConfig';

export class TransactionId {
  constructor(public value: string) {
    if (!value) {
      throw new Error('value is required');
    }
  }
}

export class RequestId {
  constructor(public value: string) {
    if (!value) {
      throw new Error('value is required');
    }
  }
}

export class Nonce {
  constructor(public value: string) {
    if (!value) {
      throw new Error('value is required');
    }
  }
}

export type Jwt = string;

export enum IdTokenType {
  SubjectSigned,
  AttesterSigned,
}

export interface PresentationType {
  presentationDefinitionOrNull(): PresentationDefinition | undefined;
}

export namespace PresentationType {
  export class IdTokenRequest implements PresentationType {
    constructor(public idTokenType: IdTokenType[]) {}

    presentationDefinitionOrNull(): PresentationDefinition | undefined {
      return undefined;
    }
  }

  export class VpTokenRequest implements PresentationType {
    constructor(public presentationDefinition: PresentationDefinition) {}

    presentationDefinitionOrNull(): PresentationDefinition | undefined {
      return this.presentationDefinition;
    }
  }

  export class IdAndVpToken implements PresentationType {
    constructor(
      public idTokenType: IdTokenType[],
      public presentationDefinition: PresentationDefinition
    ) {}

    presentationDefinitionOrNull(): PresentationDefinition | undefined {
      return this.presentationDefinition;
    }
  }
}

export interface WalletResponse {}

export namespace WalletResponse {
  export class IdToken implements WalletResponse {
    constructor(public idToken: Jwt) {
      if (!idToken) {
        throw new Error('idToken is required');
      }
    }
  }

  export class VpToken implements WalletResponse {
    constructor(
      public vpToken: string,
      public presentationSubmission: PresentationSubmission
    ) {
      if (!vpToken) {
        throw new Error('vpToken is required');
      }
    }
  }

  export class IdAndVpToken implements WalletResponse {
    constructor(
      public idToken: string,
      public vpToken: string,
      public presentationSubmission: PresentationSubmission
    ) {
      if (!idToken) {
        throw new Error('idToken is required');
      }
      if (!vpToken) {
        throw new Error('vpToken is required');
      }
    }
  }

  export class Error implements WalletResponse {
    constructor(public value: string, public description?: string) {}
  }
}

export class EphemeralEncryptionKeyPairJWK {
  constructor(public value: string) {}
}

export class ResponseCode {
  constructor(public value: string) {}
}

export interface GetWalletResponseMethod {}

export namespace GetWalletResponseMethod {
  export class Poll implements GetWalletResponseMethod {}

  export class Redirect implements GetWalletResponseMethod {
    constructor(public redirectUriTemplate: string) {}
  }

  export namespace Redirect {}
}

export interface Presentation {
  id: TransactionId;
  initiatedAt: Date;
  type: PresentationType;

  isExpired(at: Date): boolean;
}

export namespace Presentation {
  export class Requested implements Presentation {
    constructor(
      public id: TransactionId,
      public initiatedAt: Date,
      public type: PresentationType,
      public requestId: RequestId,
      public nonce: Nonce,
      public ephemeralEcPrivateKey: EphemeralEncryptionKeyPairJWK | undefined,
      public responseMode: ResponseModeOption,
      public presentationDefinitionMode: EmbedOption<RequestId>,
      public getWalletResponseMethod: GetWalletResponseMethod
    ) {}

    isExpired(at: Date): boolean {
      const initiatedAtEpoc = this.initiatedAt.getTime();
      const atEpoc = at.getTime();
      return initiatedAtEpoc < atEpoc || initiatedAtEpoc === atEpoc;
    }

    retrieveRequestObject(clock: Date): Result<RequestObjectRetrieved> {
      return RequestObjectRetrieved.requestObjectRetrieved(this, clock);
    }

    timedOut(clock: Date): Result<TimedOut> {
      return TimedOut.timeOut(this, clock);
    }
  }

  export class RequestObjectRetrieved implements Presentation {
    private constructor(
      public id: TransactionId,
      public initiatedAt: Date,
      public type: PresentationType,
      public requestId: RequestId,
      public requestObjectRetrievedAt: Date,
      public nonce: Nonce,
      public ephemeralEcPrivateKey: EphemeralEncryptionKeyPairJWK | undefined,
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

    isExpired(at: Date): boolean {
      const requestObjectRetrievedAtEpoc =
        this.requestObjectRetrievedAt.getTime();
      const atEpoc = at.getTime();
      return (
        requestObjectRetrievedAtEpoc < atEpoc ||
        requestObjectRetrievedAtEpoc === atEpoc
      );
    }

    timedOut(clock: Date): Result<TimedOut> {
      return TimedOut.timeOut(this, clock);
    }

    submit(
      clock: Date,
      walletResponse: WalletResponse,
      responseCode: ResponseCode | undefined
    ): Result<Submitted> {
      return Submitted.submitted(this, clock, walletResponse, responseCode);
    }

    static requestObjectRetrieved(
      requested: Requested,
      at: Date
    ): Result<RequestObjectRetrieved> {
      return runCatching<RequestObjectRetrieved>(
        () =>
          new RequestObjectRetrieved(
            requested.id,
            requested.initiatedAt,
            requested.type,
            requested.requestId,
            at,
            requested.nonce,
            requested.ephemeralEcPrivateKey,
            requested.responseMode,
            requested.getWalletResponseMethod
          )
      );
    }
  }

  export class Submitted implements Presentation {
    private constructor(
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

    isExpired(at: Date): boolean {
      const initiatedAtEpoc = this.initiatedAt.getTime();
      const atEpoc = at.getTime();
      return initiatedAtEpoc < atEpoc || initiatedAtEpoc === atEpoc;
    }

    timedOut(clock: Date): Result<TimedOut> {
      return TimedOut.timeOut(this, clock);
    }

    static submitted(
      requestObjectRetrieved: RequestObjectRetrieved,
      at: Date,
      walletResponse: WalletResponse,
      responseCode: ResponseCode | undefined
    ): Result<Submitted> {
      return runCatching<Submitted>(
        () =>
          new Submitted(
            requestObjectRetrieved.id,
            requestObjectRetrieved.initiatedAt,
            requestObjectRetrieved.type,
            requestObjectRetrieved.requestId,
            requestObjectRetrieved.requestObjectRetrievedAt,
            at,
            walletResponse,
            requestObjectRetrieved.nonce,
            responseCode
          )
      );
    }
  }

  export class TimedOut implements Presentation {
    private constructor(
      public id: TransactionId,
      public initiatedAt: Date,
      public type: PresentationType,
      public requestObjectRetrievedAt: Date | undefined = undefined,
      public submittedAt: Date | undefined = undefined,
      public timedOutAt: Date
    ) {}

    // eslint-disable-next-line no-unused-vars
    isExpired(_: Date): boolean {
      return false;
    }

    private static isSubmitted(
      presentation: Requested | RequestObjectRetrieved | Submitted
    ): presentation is Submitted {
      return (
        typeof (presentation as Submitted).requestObjectRetrievedAt !==
          'undefined' &&
        typeof (presentation as Submitted).submittedAt !== 'undefined'
      );
    }

    private static isRequestObjectRetrieved(
      presentation: Requested | RequestObjectRetrieved | Submitted
    ): presentation is RequestObjectRetrieved {
      return (
        typeof (presentation as Submitted).requestObjectRetrievedAt !==
          'undefined' &&
        typeof (presentation as Submitted).submittedAt === 'undefined'
      );
    }

    static timeOut(
      presentation: Requested | RequestObjectRetrieved | Submitted,
      at: Date
    ): Result<TimedOut> {
      return runCatching<TimedOut>(() => {
        const initiatedAtEpoc = presentation.initiatedAt.getTime();
        const atEpoc = at.getTime();

        if (initiatedAtEpoc > atEpoc) {
          throw new Error('initiatedAt must be earlier than at');
        }
        if (this.isSubmitted(presentation)) {
          return new TimedOut(
            presentation.id,
            presentation.initiatedAt,
            presentation.type,
            presentation.requestObjectRetrievedAt,
            presentation.submittedAt,
            at
          );
        }
        if (this.isRequestObjectRetrieved(presentation)) {
          return new TimedOut(
            presentation.id,
            presentation.initiatedAt,
            presentation.type,
            presentation.requestObjectRetrievedAt,
            undefined,
            at
          );
        }
        return new TimedOut(
          presentation.id,
          presentation.initiatedAt,
          presentation.type,
          undefined,
          undefined,
          at
        );
      });
    }
  }
}
