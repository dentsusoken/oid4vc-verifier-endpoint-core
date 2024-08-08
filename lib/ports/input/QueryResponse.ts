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

export interface QueryResponse<T> {
  __type: 'NotFound' | 'InvalidState' | 'Found';
  value: T;
}

export namespace QueryResponse {
  export class NotFound implements QueryResponse<never> {
    static readonly INSTANCE: QueryResponse<never> = new NotFound();

    __type = 'NotFound' as const;

    private constructor() {}

    get value(): never {
      throw new Error('NotFound does not have a value');
    }
  }

  export class InvalidState implements QueryResponse<never> {
    static readonly INSTANCE: QueryResponse<never> = new InvalidState();

    __type = 'InvalidState' as const;

    private constructor() {}

    get value(): never {
      throw new Error('InvalidState does not have a value');
    }
  }

  export class Found<T> implements QueryResponse<T> {
    __type = 'Found' as const;

    constructor(public readonly value: T) {}
  }
}
