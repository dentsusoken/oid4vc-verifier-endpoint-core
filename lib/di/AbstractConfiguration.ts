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
  RequestId,
  ResponseModeOption,
  Duration,
  JarmOption,
  VerifierConfig,
  BuildUrl,
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
  #jarByReference: EmbedOption.ByReference<RequestId> =
    new EmbedOption.ByReference(
      (id: RequestId) =>
        new URL(`${this.publicUrl()}/wallet/request.jwt/${id.value}`)
    );
  #presentationDefinitionByReference: EmbedOption.ByReference<RequestId> =
    new EmbedOption.ByReference(
      (id: RequestId) => new URL(`${this.publicUrl()}/wallet/pd/${id.value}`)
    );

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
   * Function to get the JAR option by reference
   * @type {() => EmbedOption.ByReference<RequestId>}
   */
  jarByReference = (): EmbedOption.ByReference<RequestId> =>
    this.#jarByReference;

  /**
   * Function to get the JAR option
   * @type {() => EmbedOption<RequestId>}
   */
  jarOption = (): EmbedOption<RequestId> => {
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
   * @type {() => EmbedOption.ByReference<RequestId>}
   */
  presentationDefinitionByReference = (): EmbedOption.ByReference<RequestId> =>
    this.#presentationDefinitionByReference;

  /**
   * Function to get the presentation definition option
   * @type {() => EmbedOption<RequestId>}
   */
  presentationDefinitionOption = (): EmbedOption<RequestId> => {
    if (this.presentationDefinitionOptionName() === 'by_value') {
      return EmbedOption.ByValue.INSTANCE;
    }

    return this.presentationDefinitionByReference();
  };

  /**
   * Function to get the JWK option
   * @type {() => EmbedOption<RequestId>}
   */
  jwkOption = (): EmbedOption<RequestId> => EmbedOption.ByValue.INSTANCE;

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
   * Function to get the response URI builder
   * @type {() => BuildUrl<RequestId>}
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  responseUriBuilder = (): BuildUrl<RequestId> => (_) =>
    new URL(`${this.publicUrl()}/wallet/direct_post`);

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
      this.responseUriBuilder(),
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
