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
  ClientIdScheme,
  ClientMetaData,
  Duration,
  EmbedOption,
  JarmOption,
  UrlBuilder,
  ResponseModeOption,
  SigningConfig,
  VerifierConfig,
} from '../domain';

/**
 * Type definition for client ID scheme names
 * @typedef {'pre-registered' | 'x509_san_dns' | 'x509_san_uri'} ClientIdSchemeName
 */
export type ClientIdSchemeName =
  | 'pre-registered'
  | 'x509_san_dns'
  | 'x509_san_uri';

/**
 * Type definition for embed option names
 * @typedef {'by_value' | 'by_reference'} EmbedOptionName
 */
export type EmbedOptionName = 'by_value' | 'by_reference';

/**
 * Type definition for response mode option names
 * @typedef {`${ResponseModeOption}`} ResponseModeOptionName
 */
export type ResponseModeOptionName = `${ResponseModeOption}`;

/**
 * Configuration interface
 * @interface Configuration
 */
export interface Configuration {
  /**
   * Function to get the byte length of the transaction ID
   * @returns {number} Byte length of the transaction ID
   */
  transactionIdByteLength(): number;

  /**
   * Function to get the byte length of the request ID
   * @returns {number} Byte length of the request ID
   */
  requestIdByteLength(): number;

  /**
   * Function to get a function that returns the current date
   * @returns {() => Date} Function that returns the current date
   */
  now(): () => Date;

  /**
   * Function to get the private JWK used for signing the JAR
   * @returns {string} Private JWK used for signing the JAR
   */
  jarSigningPrivateJwk(): string;

  /**
   * Function to get the signing configuration for the JAR
   * @returns {SigningConfig} Signing configuration for the JAR
   */
  jarSigning(): SigningConfig;

  /**
   * Function to get the client ID
   * @returns {string} Client ID
   */
  clientId(): string;

  /**
   * Function to get the client ID scheme name
   * @returns {ClientIdSchemeName} Client ID scheme name
   */
  clientIdSchemeName(): ClientIdSchemeName;

  /**
   * Function to get the client ID scheme
   * @returns {ClientIdScheme} Client ID scheme
   */
  clientIdScheme(): ClientIdScheme;

  /**
   * Function to get the public URL
   * @returns {string} Public URL
   */
  publicUrl(): string;

  /**
   * Function to get the JAR option name
   * @returns {EmbedOptionName} JAR option name
   */
  jarOptionName(): EmbedOptionName;

  /**
   * Function to get the JAR option by reference
   * @returns {EmbedOption.ByReference} JAR option by reference
   */
  jarByReference(): EmbedOption.ByReference;

  /**
   * Function to get the JAR option
   * @returns {EmbedOption<RequestId>} JAR option
   */
  jarOption(): EmbedOption;

  /**
   * Function to get the response mode option name
   * @returns {ResponseModeOptionName} Response mode option name
   */
  responseModeOptionName(): ResponseModeOptionName;

  /**
   * Function to get the response mode option
   * @returns {ResponseModeOption} Response mode option
   */
  responseModeOption(): ResponseModeOption;

  /**
   * Function to get the presentation definition option name
   * @returns {EmbedOptionName} Presentation definition option name
   */
  presentationDefinitionOptionName(): EmbedOptionName;

  /**
   * Function to get the presentation definition option by reference
   * @returns {EmbedOption.ByReference} Presentation definition option by reference
   */
  presentationDefinitionByReference(): EmbedOption.ByReference;

  /**
   * Function to get the presentation definition option
   * @returns {EmbedOption} Presentation definition option
   */
  presentationDefinitionOption(): EmbedOption;

  /**
   * Function to get the maximum age
   * @returns {Duration} Maximum age
   */
  maxAge(): Duration;

  /**
   * Function to get the JWK option
   * @returns {EmbedOption} JWK option
   */
  jwkOption(): EmbedOption;

  /**
   * Function to get the signed response algorithm for the ID token
   * @returns {string | undefined} Signed response algorithm for the ID token
   */
  idTokenSignedResponseAlg(): string | undefined;

  /**
   * Function to get the encrypted response algorithm for the ID token
   * @returns {string | undefined} Encrypted response algorithm for the ID token
   */
  idTokenEncryptedResponseAlg(): string | undefined;

  /**
   * Function to get the encrypted response encryption for the ID token
   * @returns {string | undefined} Encrypted response encryption for the ID token
   */
  idTokenEncryptedResponseEnc(): string | undefined;

  /**
   * Function to get the supported subject syntax types
   * @returns {string[]} Supported subject syntax types
   */
  subjectSyntaxTypesSupported(): string[];

  /**
   * Function to get the signed response algorithm for the authorization
   * @returns {string | undefined} Signed response algorithm for the authorization
   */
  authorizationSignedResponseAlg(): string | undefined;

  /**
   * Function to get the encrypted response algorithm for the authorization
   * @returns {string | undefined} Encrypted response algorithm for the authorization
   */
  authorizationEncryptedResponseAlg(): string | undefined;

  /**
   * Function to get the encrypted response encryption for the authorization
   * @returns {string | undefined} Encrypted response encryption for the authorization
   */
  authorizationEncryptedResponseEnc(): string | undefined;

  /**
   * Function to get the JARM option
   * @returns {JarmOption} JARM option
   */
  jarmOption(): JarmOption;

  /**
   * Function to get the client metadata
   * @returns {ClientMetaData} Client metadata
   */
  clientMetaData(): ClientMetaData;

  /**
   * Function to get the response URI builder
   * @returns {UrlBuilder} Response URI builder
   */
  responseUrlBuilder(): UrlBuilder;

  /**
   * Function to get the verifier configuration
   * @returns {VerifierConfig} Verifier configuration
   */
  verifierConfig(): VerifierConfig;

  /**
   * initiate transaction path for Verifier Frontend
   */
  initTransactionPath(): string;
  /**
   * get wallet response path for Verifier Frontend
   * @param {string} placeholder - Placeholder for path parameter
   */
  getWalletResponsePath(placeholder: string): string;
  /**
   * get public JWK set path for Wallet
   */
  getPublicJWKSetPath(): string;
  /**
   * get request object path for Wallet
   * @param {string} placeholder - Placeholder for path parameter
   */
  requestJWTPath(placeholder: string): string;
  /**
   * get presentation definition path for Wallet
   * @param {string} placeholder - Placeholder for path parameter
   */
  presentationDefinitionPath(placeholder: string): string;
  /**
   * get jarm JWK set path for Wallet
   * @param {string} placeholder - Placeholder for path parameter
   */
  jarmJWKSetPath(placeholder: string): string;
  /**
   * post wallet response path for Wallet
   */
  walletResponsePath(): string;
}
