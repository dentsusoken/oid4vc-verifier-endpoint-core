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

/**
 * A function that builds a URL for a given resource identifier.
 * @template ID - The type of the resource identifier.
 * @param id - The identifier of the resource.
 * @returns The URL of the resource.
 */

import { RequestId } from '.';

export type BuildUrl<ID> = (id: ID) => URL;

export namespace BuildUrl {
  interface Base<ID> {
    readonly __type: 'RequestId';

    buildUrl(id: ID): URL;
  }

  export class WithRequestId implements Base<RequestId> {
    readonly __type = 'RequestId' as const;

    constructor(public baseUrl: string) {}

    buildUrl(id: RequestId): URL {
      return new URL(`${this.baseUrl}${id.value}`);
    }
  }
}
