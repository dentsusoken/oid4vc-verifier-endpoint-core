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

import {
  ClientIdSchemeName,
  Configuration,
  EmbedOptionName,
  ResponseModeOptionName,
} from './Configuration';
import {
  StaticSigningPrivateJwk,
  SigningConfig,
  ClientIdScheme,
  ClientMetaData,
  EmbedOption,
  ResponseModeOption,
  Duration,
  JarmOption,
  VerifierConfig,
  UrlBuilder,
} from '../domain';
import { importJWK } from 'jose';
import * as ParseJarmOptionJose from '../adapters/out/jose/ParseJarmOptionJose';

/**
 * Abstract class that implements the Configuration interface
 * @abstract
 * @class AbstractConfiguration
 * @implements {Configuration}
 */
export abstract class AbstractConfiguration implements Configuration {
  #now = () => new Date();
  #jarSigning: SigningConfig | undefined;
  #clientIdScheme: ClientIdScheme | undefined;
  #verifierConfig: VerifierConfig | undefined;
  #jarByReference: EmbedOption.ByReference | undefined;
  #presentationDefinitionByReference: EmbedOption.ByReference | undefined;

  /**
   * Abstract method to get the private JWK used for signing the JAR
   * @abstract
   * @returns {string} Private JWK used for signing the JAR
   */
  abstract jarSigningPrivateJwk(): string;

  /**
   * Abstract method to get the client ID
   * @abstract
   * @returns {string} Client ID
   */
  abstract clientId(): string;

  /**
   * Abstract method to get the client ID scheme name
   * @abstract
   * @returns {ClientIdSchemeName} Client ID scheme name
   */
  abstract clientIdSchemeName(): ClientIdSchemeName;

  /**
   * Abstract method to get the public URL
   * @abstract
   * @returns {string} Public URL
   */
  abstract publicUrl(): string;

  /**
   * Abstract method to get the JAR option name
   * @abstract
   * @returns {EmbedOptionName} JAR option name
   */
  abstract jarOptionName(): EmbedOptionName;

  /**
   * Abstract method to get the response mode option name
   * @abstract
   * @returns {ResponseModeOptionName} Response mode option name
   */
  abstract responseModeOptionName(): ResponseModeOptionName;

  /**
   * Abstract method to get the presentation definition option name
   * @abstract
   * @returns {EmbedOptionName} Presentation definition option name
   */
  abstract presentationDefinitionOptionName(): EmbedOptionName;

  /**
   * Abstract method to get the maximum age
   * @abstract
   * @returns {Duration} Maximum age
   */
  abstract maxAge(): Duration;

  /**
   * Function to get the byte length of the transaction ID
   * @type {() => number}
   */
  transactionIdByteLength = (): number => 64;

  /**
   * Function to get the byte length of the request ID
   * @type {() => number}
   */
  requestIdByteLength = (): number => 64;

  /**
   * Function to get the current date
   * @type {() => Date}
   */
  now = () => this.#now;

  /**
   * Function to get the signing configuration for the JAR
   * @type {() => SigningConfig}
   */
  jarSigning = (): SigningConfig => {
    if (this.#jarSigning) {
      return this.#jarSigning;
    }

    const jwkStr = this.jarSigningPrivateJwk();
    const parsedJwk = JSON.parse(jwkStr);

    if (!parsedJwk.alg) {
      throw new Error('alg not found in jarSigningPrivateJwk');
    }

    const algorithm = parsedJwk.alg;
    const staticSigningPrivateJwk: StaticSigningPrivateJwk = {
      value: jwkStr,
    };
    const cfg: SigningConfig = {
      staticSigningPrivateJwk,
      algorithm,
    };
    this.#jarSigning = cfg;

    return cfg;
  };

  /**
   * Function to get the client ID scheme
   * @type {() => ClientIdScheme}
   */
  clientIdScheme = (): ClientIdScheme => {
    if (this.#clientIdScheme) {
      return this.#clientIdScheme;
    }

    this.#clientIdScheme = createClientIdScheme(
      this.clientIdSchemeName(),
      this.clientId(),
      this.jarSigning()
    );

    return this.#clientIdScheme;
  };

  /**
   * Retrieves the JAR by reference option.
   * @returns {EmbedOption.ByReference} The JAR by reference option.
   */
  jarByReference = (): EmbedOption.ByReference => {
    if (this.#jarByReference) {
      return this.#jarByReference;
    }

    this.#jarByReference = new EmbedOption.ByReference(
      new UrlBuilder.WithRequestId(
        `${this.publicUrl()}${this.requestJWTPath('')}`
      )
    );

    return this.#jarByReference;
  };

  /**
   * Determines and returns the JAR embed option.
   * @returns {EmbedOption} The JAR embed option, either ByValue or ByReference.
   * @description This method checks the JAR option name and returns the appropriate EmbedOption.
   * If the option name is 'by_value', it returns the ByValue singleton instance.
   * Otherwise, it returns the ByReference option.
   *
   * @example
   * const embedOption = instance.jarOption();
   * if (embedOption instanceof EmbedOption.ByValue) {
   *   console.log('JAR is embedded by value');
   * } else {
   *   console.log('JAR is embedded by reference');
   * }
   */
  jarOption = (): EmbedOption => {
    if (this.jarOptionName() === 'by_value') {
      return EmbedOption.ByValue.INSTANCE;
    }

    return this.jarByReference();
  };

  /**
   * Function to get the response mode option
   * @type {() => ResponseModeOption}
   */
  responseModeOption = (): ResponseModeOption =>
    this.responseModeOptionName() as ResponseModeOption;

  /**
   * Function to get the presentation definition option by reference
   * @type {() => EmbedOption.ByReference}
   */
  presentationDefinitionByReference = (): EmbedOption.ByReference => {
    if (this.#presentationDefinitionByReference) {
      return this.#presentationDefinitionByReference;
    }

    this.#presentationDefinitionByReference = new EmbedOption.ByReference(
      new UrlBuilder.WithRequestId(
        `${this.publicUrl()}${this.presentationDefinitionPath('')}`
      )
    );

    return this.#presentationDefinitionByReference;
  };

  /**
   * Function to get the presentation definition option
   * @type {() => EmbedOption}
   */
  presentationDefinitionOption = (): EmbedOption => {
    if (this.presentationDefinitionOptionName() === 'by_value') {
      return EmbedOption.ByValue.INSTANCE;
    }

    return this.presentationDefinitionByReference();
  };

  /**
   * Function to get the JWK option
   * @type {() => EmbedOption}
   */
  jwkOption = (): EmbedOption => EmbedOption.ByValue.INSTANCE;

  /**
   * Function to get the signed response algorithm for the ID token
   * @type {() => string | undefined}
   */
  idTokenSignedResponseAlg = (): string | undefined => undefined;

  /**
   * Function to get the encrypted response algorithm for the ID token
   * @type {() => string | undefined}
   */
  idTokenEncryptedResponseAlg = (): string | undefined => 'ECDH-ES+A256KW';

  /**
   * Function to get the encrypted response encryption for the ID token
   * @type {() => string | undefined}
   */
  idTokenEncryptedResponseEnc = (): string | undefined => 'A256GCM';

  /**
   * Function to get the supported subject syntax types
   * @type {() => string[]}
   */
  subjectSyntaxTypesSupported = (): string[] => [
    'urn:ietf:params:oauth:jwk-thumbprint',
  ];

  /**
   * Function to get the signed response algorithm for the authorization
   * @type {() => string | undefined}
   */
  authorizationSignedResponseAlg = (): string | undefined => undefined;

  /**
   * Function to get the encrypted response algorithm for the authorization
   * @type {() => string | undefined}
   */
  authorizationEncryptedResponseAlg = (): string | undefined =>
    'ECDH-ES+A256KW';

  /**
   * Function to get the encrypted response encryption for the authorization
   * @type {() => string | undefined}
   */
  authorizationEncryptedResponseEnc = (): string | undefined => 'A256GCM';

  /**
   * Function to get the JARM option
   * @type {() => JarmOption}
   */
  jarmOption = (): JarmOption =>
    ParseJarmOptionJose.parseJarmOption(
      this.authorizationSignedResponseAlg(),
      this.authorizationEncryptedResponseAlg(),
      this.authorizationEncryptedResponseEnc()
    )!;

  /**
   * Function to get the client metadata
   * @type {() => ClientMetaData}
   */
  clientMetaData = (): ClientMetaData =>
    new ClientMetaData(
      this.jwkOption(),
      this.idTokenSignedResponseAlg(),
      this.idTokenEncryptedResponseAlg(),
      this.idTokenEncryptedResponseEnc(),
      this.subjectSyntaxTypesSupported(),
      this.jarmOption()
    );

  /**
   * Function to get the response URL builder
   * @type {() => UrlBuilder}
   */
  responseUrlBuilder = (): UrlBuilder =>
    new UrlBuilder.Fix(`${this.publicUrl()}${this.walletResponsePath()}`);

  /**
   * Function to get the verifier configuration
   * @type {() => VerifierConfig}
   */
  verifierConfig = (): VerifierConfig => {
    if (this.#verifierConfig) {
      return this.#verifierConfig;
    }

    this.#verifierConfig = new VerifierConfig(
      this.clientIdScheme(),
      this.jarOption(),
      this.presentationDefinitionOption(),
      this.responseModeOption(),
      this.responseUrlBuilder(),
      this.maxAge(),
      this.clientMetaData()
    );

    return this.#verifierConfig;
  };

  /**
   * Asynchronous method to validate the configuration
   * @async
   */
  async validate() {
    const signingJwk = JSON.parse(this.jarSigningPrivateJwk());
    await importJWK(signingJwk);
  }

  /**
   * initiate transaction path for Verifier Frontend
   */
  initTransactionPath = (): string => '/ui/presentations';
  /**
   * get wallet response path for Verifier Frontend
   */
  getWalletResponsePath = (placeholder: string): string =>
    '/ui/presentations/{placeholder}'.replace('{placeholder}', placeholder);
  /**
   * get public JWK set path for Wallet
   */
  getPublicJWKSetPath = (): string => '/wallet/public-keys.json';
  /**
   * get request object path for Wallet
   */
  requestJWTPath = (placeholder: string): string =>
    '/wallet/request.jwt/{placeholder}'.replace('{placeholder}', placeholder);
  /**
   * get presentation definition path for Wallet
   */
  presentationDefinitionPath = (placeholder: string): string =>
    '/wallet/pd/{placeholder}'.replace('{placeholder}', placeholder);
  /**
   * get jarm JWK set path for Wallet
   */
  jarmJWKSetPath = (placeholder: string): string =>
    '/wallet/jarm/{placeholder}/jwks.json'.replace(
      '{placeholder}',
      placeholder
    );
  /**
   * post wallet response path for Wallet
   */
  walletResponsePath = (): string => '/wallet/direct_post/';
}

/**
 * Function to create a client ID scheme based on the provided parameters
 * @param {ClientIdSchemeName} clientIdSchemeName - The name of the client ID scheme
 * @param {string} clientId - The client ID
 * @param {SigningConfig} jarSigning - The signing configuration for the JAR
 * @returns {ClientIdScheme} The created client ID scheme
 */
const createClientIdScheme = (
  clientIdSchemeName: ClientIdSchemeName,
  clientId: string,
  jarSigning: SigningConfig
) => {
  switch (clientIdSchemeName) {
    case 'pre-registered':
      return new ClientIdScheme.PreRegistered(clientId, jarSigning);
    case 'x509_san_dns':
      return new ClientIdScheme.X509SanDns(clientId, jarSigning);
    case 'x509_san_uri':
      return new ClientIdScheme.X509SanUri(clientId, jarSigning);
  }
};
