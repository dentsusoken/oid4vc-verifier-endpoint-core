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
import { PresentationDefinition } from '../../../mock/prex/PresentationDefinition';
import { LoadPresentationByRequestId } from '../out/persistence';
import { Presentation, RequestId } from '../../domain';
import { QueryResponse } from './QueryResponse';

export interface GetPresentationDefinition {
  invoke(requestId: RequestId): QueryResponse<PresentationDefinition>;
}

export class GetPresentationDefinitionLive
  implements GetPresentationDefinition
{
  constructor(
    private loadPresentationByRequestId: LoadPresentationByRequestId
  ) {}

  async invoke(
    requestId: RequestId
  ): Promise<QueryResponse<PresentationDefinition>> {
    const foundOrInvalid = (p: Presentation) => {
      const it = p.type.presentationDefinitionOrNull();
      return it ? new QueryResponse.Found(it) : QueryResponse.InvalidState;
    };

    const presentation = await this.loadPresentationByRequestId(requestId);

    switch (presentation instanceof Presentation.RequestObjectRetrieved) {
      case true:
        return foundOrInvalid(
          presentation as Presentation.RequestObjectRetrieved
        );
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
