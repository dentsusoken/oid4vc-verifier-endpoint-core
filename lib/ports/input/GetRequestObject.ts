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
import { Jwt, RequestId } from '../../domain';
import { QueryResponse } from './QueryResponse';

/**
 * Represents a function that retrieves a request object based on a request ID.
 *
 * @interface GetRequestObject
 * @description This interface defines a function that takes a RequestId and returns a Promise
 * resolving to a QueryResponse containing a Jwt. The function is used to fetch
 * a request object associated with the given request ID.
 */
export interface GetRequestObject {
  /**
   * Retrieves a request object based on the provided request ID.
   *
   * @param {RequestId} requestId - The unique identifier of the request to retrieve.
   * @returns {Promise<QueryResponse<Jwt>>} A promise that resolves to a QueryResponse containing
   * the Jwt of the requested object. The QueryResponse can be in one of three states:
   * NotFound (if the request object doesn't exist), InvalidState (if the request object
   * is in an invalid state), or Found (containing the Jwt).
   */
  (requestId: RequestId): Promise<QueryResponse<Jwt>>;
}

// export class GetRequestObjectLive implements GetRequestObject {
//   constructor(
//     private loadPresentationByRequestId: LoadPresentationByRequestId,
//     private storePresentation: StorePresentation,
//     private signRequestObject: SignRequestObject,
//     private verifierConfig: VerifierConfig,
//     private clock: Date
//   ) {}

//   async invoke(requestId: RequestId): Promise<QueryResponse<Jwt>> {
//     const presentation = await this.loadPresentationByRequestId(requestId);
//     switch (presentation instanceof PresentationNS.Requested) {
//       case true:
//         return new QueryResponse.Found(
//           this.requestObjectOf(presentation as PresentationNS.Requested)
//         );
//       default:
//         switch (presentation) {
//           case undefined:
//             return QueryResponse.NotFound;
//           default:
//             return QueryResponse.InvalidState;
//         }
//     }
//   }

//   private async requestObjectOf(
//     presentation: PresentationNS.Requested
//   ): Promise<Jwt> {
//     const jwt = (
//       await this.signRequestObject(
//         this.verifierConfig,
//         { now: () => this.clock },
//         presentation
//       )
//     ).getOrThrow();
//     const updatedPresentation = presentation
//       .retrieveRequestObject(this.clock)
//       .getOrThrow();
//     this.storePresentation(updatedPresentation);
//     return jwt;
//   }
// }
