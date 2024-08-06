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
 * Represents the configuration for a client ID scheme.
 */
export interface ClientIdScheme {
  clientId: string;
  jarSigning: SigningConfig;
}

/**
 * Namespace containing implementations and type guards for various ClientIdScheme types.
 */
export namespace ClientIdSchemeNS {
  /**
   * Represents a pre-registered client ID scheme.
   */
  export class PreRegistered implements ClientIdScheme {
    constructor(public clientId: string, public jarSigning: SigningConfig) {}
  }

  /**
   * Represents a client ID scheme using X.509 Subject Alternative Name DNS.
   */
  export class X509SanDns implements ClientIdScheme {
    constructor(public clientId: string, public jarSigning: SigningConfig) {}
  }

  /**
   * Represents a client ID scheme using X.509 Subject Alternative Name URI.
   */
  export class X509SanUri implements ClientIdScheme {
    constructor(public clientId: string, public jarSigning: SigningConfig) {}
  }

  /**
   * Checks if a ClientIdScheme is an instance of PreRegistered.
   * @param scheme - The ClientIdScheme to check.
   * @returns True if the scheme is an instance of PreRegistered, false otherwise.
   */
  export function isPreRegistered(
    scheme: ClientIdScheme
  ): scheme is PreRegistered {
    return scheme.constructor === PreRegistered;
  }

  /**
   * Checks if a ClientIdScheme is an instance of X509SanDns.
   * @param scheme - The ClientIdScheme to check.
   * @returns True if the scheme is an instance of X509SanDns, false otherwise.
   */
  export function isX509SanDns(scheme: ClientIdScheme): scheme is X509SanDns {
    return scheme.constructor === X509SanDns;
  }

  /**
   * Checks if a ClientIdScheme is an instance of X509SanUri.
   * @param scheme - The ClientIdScheme to check.
   * @returns True if the scheme is an instance of X509SanUri, false otherwise.
   */
  export function isX509SanUri(scheme: ClientIdScheme): scheme is X509SanUri {
    return scheme.constructor === X509SanUri;
  }
}
