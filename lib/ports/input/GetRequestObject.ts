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
import { Jwt, Presentation, RequestId, VerifierConfig } from '../../domain';
import { SignRequestObject } from '../out/jose';
import {
  LoadPresentationByRequestId,
  StorePresentation,
} from '../out/persistence';
import { QueryResponse } from './QueryResponse';

export interface GetRequestObject {
  invoke(requestId: RequestId): Promise<QueryResponse<Jwt>>;
}

export class GetRequestObjectLive implements GetRequestObject {
  constructor(
    private loadPresentationByRequestId: LoadPresentationByRequestId,
    private storePresentation: StorePresentation,
    private signRequestObject: SignRequestObject,
    private verifierConfig: VerifierConfig,
    private clock: Date
  ) {}

  async invoke(requestId: RequestId): Promise<QueryResponse<Jwt>> {
    const presentation = await this.loadPresentationByRequestId(requestId);
    switch (presentation instanceof Presentation.Requested) {
      case true:
        return new QueryResponse.Found(
          this.requestObjectOf(presentation as Presentation.Requested)
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

  private requestObjectOf(presentation: Presentation.Requested): Jwt {
    const jwt = this.signRequestObject(
      this.verifierConfig,
      this.clock,
      presentation
    ).getOrThrow();
    const updatedPresentation = presentation
      .retrieveRequestObject(this.clock)
      .getOrThrow();
    this.storePresentation(updatedPresentation);
    return jwt;
  }
}
