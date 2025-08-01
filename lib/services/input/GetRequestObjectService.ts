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

import { RequestId, VerifierConfig, Jwt } from '../../domain';
import { SignRequestObject } from '../../ports/out/jose';
import {
  LoadPresentationByRequestId,
  StorePresentation,
} from '../../ports/out/persistence';
import { GetRequestObject, QueryResponse } from '../../ports/input';
import { runAsyncCatching } from '@vecrea/oid4vc-core/utils';

export type GetRequestObjectServiceCreateParams = {
  loadPresentationByRequestId: LoadPresentationByRequestId;
  storePresentation: StorePresentation;
  signRequestObject: SignRequestObject;
  verifierConfig: VerifierConfig;
  now: () => Date;
};

export const createGetRequestObjectServiceInvoker =
  ({
    loadPresentationByRequestId,
    storePresentation,
    signRequestObject,
    verifierConfig,
    now,
  }: GetRequestObjectServiceCreateParams): GetRequestObject =>
  async (requestId: RequestId): Promise<QueryResponse<Jwt>> => {
    const presentation = await loadPresentationByRequestId(requestId);

    if (!presentation) {
      return new QueryResponse.NotFound(
        `Presentation not found for requestId: ${requestId.value}`
      );
    }

    if (presentation.__type !== 'Requested') {
      return new QueryResponse.InvalidState(
        `Invalid presentation state. Expected 'Requested', but found '${presentation.__type}'.`
      );
    }

    const result = await runAsyncCatching(async () => {
      const jwt = (
        await signRequestObject(verifierConfig, now, presentation)
      ).getOrThrow();
      const retrievedRequestObject = presentation
        .retrieveRequestObject(now())
        .getOrThrow();
      await storePresentation(retrievedRequestObject);

      return jwt;
    });

    if (result.isFailure()) {
      return new QueryResponse.InvalidState(`${result.error?.toString()}`);
    }

    return new QueryResponse.Found(result.getOrThrow());
  };
