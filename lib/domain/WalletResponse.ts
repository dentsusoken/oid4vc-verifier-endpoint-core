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

import { PresentationSubmission } from 'oid4vc-prex';
import { Jwt } from '.';

export type WalletResponse =
  | WalletResponse.IdToken
  | WalletResponse.VpToken
  | WalletResponse.IdAndVpToken
  | WalletResponse.WalletResponseError;

export namespace WalletResponse {
  interface WalletResponse {
    readonly __type:
      | 'IdToken'
      | 'VpToken'
      | 'IdAndVpToken'
      | 'WalletResponseError';
  }

  export class IdToken implements WalletResponse {
    readonly __type = 'IdToken';

    constructor(public idToken: Jwt) {
      if (!idToken) {
        throw new Error('idToken is required');
      }
    }
  }

  export class VpToken implements WalletResponse {
    readonly __type = 'VpToken';

    constructor(
      public vpToken: Jwt,
      public presentationSubmission: PresentationSubmission
    ) {
      if (!vpToken) {
        throw new Error('vpToken is required');
      }
    }
  }

  export class IdAndVpToken implements WalletResponse {
    readonly __type = 'IdAndVpToken';

    constructor(
      public idToken: Jwt,
      public vpToken: Jwt,
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

  export class WalletResponseError implements WalletResponse {
    readonly __type = 'WalletResponseError';

    constructor(public value: string, public description?: string) {}
  }
}
