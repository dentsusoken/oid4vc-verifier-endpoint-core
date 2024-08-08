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
import { RequestId } from '../../domain';
import { QueryResponse } from './QueryResponse';

/**
 * Represents a JSON Web Key Set (JWKS).
 *
 * @typedef {Object} JwkSet
 * @property {[Record<string, unknown>]} keys - An array containing at least one JSON Web Key (JWK).
 * Each JWK is represented as a Record with string keys and unknown values.
 */
export type JwkSet = {
  keys: [Record<string, unknown>];
};

/**
 * Represents a function that retrieves a JSON Web Key Set (JWKS) for JARM (JWT Secured Authorization Response Mode).
 *
 * @interface GetJarmJwks
 * @description This interface defines a function that takes a RequestId and returns a Promise
 * resolving to a QueryResponse containing a JwkSet. The function is used to fetch
 * the JWKS associated with the given request ID for JARM purposes.
 */
export interface GetJarmJwks {
  /**
   * Retrieves a JARM JWKS based on the provided request ID.
   *
   * @param {RequestId} id - The unique identifier of the request to retrieve the JWKS for.
   * @returns {Promise<QueryResponse<JwkSet>>} A promise that resolves to a QueryResponse containing
   * the JwkSet for JARM. The QueryResponse can be in one of three states:
   * NotFound (if the JWKS doesn't exist), InvalidState (if the JWKS is in an invalid state),
   * or Found (containing the JwkSet).
   */
  (id: RequestId): Promise<QueryResponse<JwkSet>>;
}

// import { PresentationNS, RequestId } from '../../domain';
// import { jwk } from '../../adapters/out/jose';
// import { QueryResponse } from './QueryResponse';
// import * as jose from 'jose';
// import { LoadPresentationByRequestId } from '../out/persistence';
// export class GetJarmJwksLive implements GetJarmJwks {
//   constructor(
//     private loadPresentationByRequestId: LoadPresentationByRequestId
//   ) {}

//   async invoke(id: RequestId): Promise<QueryResponse<JWKSet>> {
//     const presentation = await this.loadPresentationByRequestId(id);

//     switch (presentation instanceof PresentationNS.RequestObjectRetrieved) {
//       case true:
//         const it = await ephemeralEcPubKey(
//           presentation as PresentationNS.RequestObjectRetrieved
//         );
//         return it ? new QueryResponse.Found(it) : QueryResponse.InvalidState;
//       default:
//         switch (presentation) {
//           case undefined:
//             return QueryResponse.NotFound;
//           default:
//             return QueryResponse.InvalidState;
//         }
//     }
//   }
// }

// export const ephemeralEcPubKey = async (
//   requestObjectRetrieved: PresentationNS.RequestObjectRetrieved
// ): Promise<JWKSet | undefined> => {
//   if (typeof requestObjectRetrieved.ephemeralEcPrivateKey !== 'undefined') {
//     const jwkSet = {
//       keys: [jwk(requestObjectRetrieved.ephemeralEcPrivateKey)],
//     } as JWKSet;

//     return toPublicJWKSet(jwkSet);
//   }
//   return undefined;
// };
