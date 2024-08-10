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

export type GetWalletResponseMethod =
  | GetWalletResponseMethod.Poll
  | GetWalletResponseMethod.Redirect;

export namespace GetWalletResponseMethod {
  interface GetWalletResponseMethod {
    readonly __type: 'Poll' | 'Redirect';
  }

  export class Poll implements GetWalletResponseMethod {
    static readonly INSTANCE = new Poll();

    readonly __type = 'Poll';

    private constructor() {}
  }

  export class Redirect implements GetWalletResponseMethod {
    readonly __type = 'Redirect';

    constructor(public redirectUriTemplate: string) {}
  }
}
