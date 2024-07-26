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
import { Presentation, RequestId } from '../../domain';
import { jwk } from '../../adapter/out/jose';
import { QueryResponse } from './QueryResponse';
import * as jose from 'jose';
import { LoadPresentationByRequestId } from '../out/persistence';

// TODO - Confirm if this is the correct type
type JWKSet = jose.JSONWebKeySet;

// TODO - Remove this Mock interface
const toPublicJWKSet = (jwkSet: JWKSet): JWKSet => jwkSet;

export interface GetJarmJwks {
  invoke(id: RequestId): Promise<QueryResponse<JWKSet>>;
}

export class GetJarmJwksLive implements GetJarmJwks {
  constructor(
    private loadPresentationByRequestId: LoadPresentationByRequestId
  ) {}

  async invoke(id: RequestId): Promise<QueryResponse<JWKSet>> {
    const presentation = await this.loadPresentationByRequestId(id);

    switch (presentation instanceof Presentation.RequestObjectRetrieved) {
      case true:
        const it = await ephemeralEcPubKey(
          presentation as Presentation.RequestObjectRetrieved
        );
        return it ? new QueryResponse.Found(it) : QueryResponse.InvalidState;
      default:
        switch (presentation) {
          case undefined:
            return QueryResponse.NotFound;
          default:
            return QueryResponse.InvalidState;
        }
    }
  }
}

export const ephemeralEcPubKey = async (
  requestObjectRetrieved: Presentation.RequestObjectRetrieved
): Promise<JWKSet | undefined> => {
  if (typeof requestObjectRetrieved.ephemeralEcPrivateKey !== 'undefined') {
    const jwkSet = {
      keys: [jwk(requestObjectRetrieved.ephemeralEcPrivateKey)],
    } as JWKSet;

    return toPublicJWKSet(jwkSet);
  }
  return undefined;
};
