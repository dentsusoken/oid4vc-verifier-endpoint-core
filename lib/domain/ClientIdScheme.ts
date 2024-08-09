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

import { SigningConfig } from './SigningConfig';

/**
 * Represents a client ID scheme configuration.
 * This type can be one of the following:
 * - PreRegistered: A pre-registered client ID scheme.
 * - X509SanDns: A client ID scheme using X.509 Subject Alternative Name DNS.
 * - X509SanUri: A client ID scheme using X.509 Subject Alternative Name URI.
 *
 * @typedef {ClientIdScheme.PreRegistered | ClientIdScheme.X509SanDns | ClientIdScheme.X509SanUri} ClientIdScheme
 */
export type ClientIdScheme =
  | ClientIdScheme.PreRegistered
  | ClientIdScheme.X509SanDns
  | ClientIdScheme.X509SanUri;

/**
 * Represents the configuration for a client ID scheme.
 */
interface ClientIdSchemeInterface {
  clientId: string;
  jarSigning: SigningConfig;
}

/**
 * Namespace containing implementations and type guards for various ClientIdScheme types.
 */
export namespace ClientIdScheme {
  /**
   * Represents a pre-registered client ID scheme.
   */
  export class PreRegistered implements ClientIdSchemeInterface {
    readonly __type = 'PreRegistered' as const;

    constructor(public clientId: string, public jarSigning: SigningConfig) {}
  }

  /**
   * Represents a client ID scheme using X.509 Subject Alternative Name DNS.
   */
  export class X509SanDns implements ClientIdSchemeInterface {
    readonly __type = 'X509SanDns' as const;

    constructor(public clientId: string, public jarSigning: SigningConfig) {}
  }

  /**
   * Represents a client ID scheme using X.509 Subject Alternative Name URI.
   */
  export class X509SanUri implements ClientIdSchemeInterface {
    readonly __type = 'X509SanUri' as const;

    constructor(public clientId: string, public jarSigning: SigningConfig) {}
  }
}
