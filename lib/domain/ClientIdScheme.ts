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
 * Namespace containing implementations and type guards for various ClientIdScheme types.
 */
export namespace ClientIdScheme {
  /**
   * ClientIdScheme interface represents the scheme used for client identification.
   * It specifies the type of client ID scheme, the client ID value, and the JAR signing configuration.
   *
   * @interface ClientIdScheme
   * @property {('PreRegistered' | 'X509SanDns' | 'X509SanUri')} __type - The type of the client ID scheme.
   * It can be one of the following values:
   * - 'PreRegistered': Indicates that the client ID is pre-registered.
   * - 'X509SanDns': Indicates that the client ID is based on the X.509 Subject Alternative Name (SAN) DNS entry.
   * - 'X509SanUri': Indicates that the client ID is based on the X.509 Subject Alternative Name (SAN) URI entry.
   * @property {string} clientId - The client ID value.
   * @property {SigningConfig} jarSigning - The configuration for JAR signing.
   */
  interface ClientIdScheme {
    __type: 'PreRegistered' | 'X509SanDns' | 'X509SanUri';
    clientId: string;
    jarSigning: SigningConfig;
  }

  /**
   * Represents a pre-registered client ID scheme.
   */
  export class PreRegistered implements ClientIdScheme {
    readonly __type = 'PreRegistered' as const;

    constructor(public clientId: string, public jarSigning: SigningConfig) {}
  }

  /**
   * Represents a client ID scheme using X.509 Subject Alternative Name DNS.
   */
  export class X509SanDns implements ClientIdScheme {
    readonly __type = 'X509SanDns' as const;

    constructor(public clientId: string, public jarSigning: SigningConfig) {}
  }

  /**
   * Represents a client ID scheme using X.509 Subject Alternative Name URI.
   */
  export class X509SanUri implements ClientIdScheme {
    readonly __type = 'X509SanUri' as const;

    constructor(public clientId: string, public jarSigning: SigningConfig) {}
  }
}
