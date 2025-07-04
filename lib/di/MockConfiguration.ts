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

import { Duration } from '../domain';
import { AbstractConfiguration } from './AbstractConfiguration';
import {
  ClientIdSchemeName,
  EmbedOptionName,
  ResponseModeOptionName,
} from './Configuration';
import { DurationLuxon } from '../adapters/out/cfg';

/**
 * Private JWK for signing (for test purposes only)
 * @constant {string} SINGING_PRIVATE_JWK_FOR_TEST_ONLY
 */
const SINGING_PRIVATE_JWK_FOR_TEST_ONLY = JSON.stringify({
  kty: 'EC',
  x: 'wR8cHVLAAHN5fVSLTt2dfmkv4Vy2ZtY5zAvB3UACyKo',
  y: 'VLiFbyA9J5qCbWB6GqRPkILDxp4JXwz-A8SugkYTtvY',
  crv: 'P-256',
  d: 'Zj4MQej2kBj26cNGB4stOZEiMpWddnYjeKz1KoqnHP0',
  alg: 'ES256',
  use: 'sig',
  kid: 'e720016c-64f1-4326-b5a7-a00a34536951',
});

/**
 * Type definition for customizable entries
 * @typedef {Object} CustomizableEntries
 * @property {string} jarSigningPrivateJwk - Private JWK for signing the JAR
 * @property {string} clientId - Client ID
 * @property {ClientIdSchemeName} clientIdSchemeName - Name of the client ID scheme
 * @property {EmbedOptionName} requestJarOptionName - Name of the JAR embed option
 * @property {string} publicUrl - Public URL
 * @property {ResponseModeOptionName} responseModeOptionName - Name of the response mode option
 * @property {EmbedOptionName} presentationDefinitionOptionName - Name of the presentation definition embed option
 * @property {Duration} maxAge - Maximum age
 */
type CustomizableEntries = {
  jarSigningPrivateJwk: string;
  clientId: string;
  clientIdSchemeName: ClientIdSchemeName;
  requestJarOptionName: EmbedOptionName;
  publicUrl: string;
  responseModeOptionName: ResponseModeOptionName;
  presentationDefinitionOptionName: EmbedOptionName;
  maxAge: Duration;
};

/**
 * Type definition for customizable configuration
 * @typedef {Object} CustomizableConfig
 * @property {CustomizableEntries[P]} [P] - Optional customizable entries
 */
type CustomizableConfig = {
  [P in keyof CustomizableEntries]?: CustomizableEntries[P];
};

/**
 * Mock configuration class extending AbstractConfiguration
 * @class MockConfiguration
 * @extends AbstractConfiguration
 */
export class MockConfiguration extends AbstractConfiguration {
  /**
   * Constructor for MockConfiguration
   * @constructor
   * @param {CustomizableConfig} [customizableConfig={}] - Optional customizable configuration
   */
  constructor(private customizableConfig: CustomizableConfig = {}) {
    super();
  }

  /**
   * Function to get the private JWK for signing the JAR
   * @type {() => string}
   */
  jarSigningPrivateJwk = (): string => {
    if (this.customizableConfig?.jarSigningPrivateJwk) {
      return this.customizableConfig.jarSigningPrivateJwk;
    }

    return SINGING_PRIVATE_JWK_FOR_TEST_ONLY;
  };

  /**
   * Function to get the client ID
   * @type {() => string}
   */
  clientId = (): string => this.customizableConfig.clientId || 'Verifier';

  /**
   * Function to get the name of the client ID scheme
   * @type {() => ClientIdSchemeName}
   */
  clientIdSchemeName = (): ClientIdSchemeName =>
    this.customizableConfig.clientIdSchemeName || 'pre-registered';

  /**
   * Function to get the name of the JAR embed option
   * @type {() => EmbedOptionName}
   */
  jarOptionName = (): EmbedOptionName =>
    this.customizableConfig.requestJarOptionName || 'by_reference';

  /**
   * Function to get the public URL
   * @type {() => string}
   */
  publicUrl = (): string =>
    this.customizableConfig.publicUrl || 'http://localhost:8080';

  /**
   * Function to get the name of the response mode option
   * @type {() => ResponseModeOptionName}
   */
  responseModeOptionName = (): ResponseModeOptionName =>
    this.customizableConfig.responseModeOptionName || 'direct_post.jwt';

  /**
   * Function to get the name of the presentation definition embed option
   * @type {() => EmbedOptionName}
   */
  presentationDefinitionOptionName = (): EmbedOptionName =>
    this.customizableConfig.presentationDefinitionOptionName || 'by_value';

  /**
   * Function to get the maximum age
   * @type {() => Duration}
   */
  maxAge = (): Duration =>
    this.customizableConfig.maxAge || DurationLuxon.Factory.ofMinutes(5);

  /**
   * Function to get the frontend cors origin
   * @type {() => string | string[]}
   */
  frontendCorsOrigin = (): string | string[] => 'http://localhost:3000';
}
