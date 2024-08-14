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

type CustomizableConfig = {
  [P in keyof CustomizableEntries]?: CustomizableEntries[P];
};

export class MockConfiguration extends AbstractConfiguration {
  constructor(private customizableConfig: CustomizableConfig = {}) {
    super();
  }

  jarSigningPrivateJwk = (): string => {
    if (this.customizableConfig?.jarSigningPrivateJwk) {
      return this.customizableConfig.jarSigningPrivateJwk;
    }

    return SINGING_PRIVATE_JWK_FOR_TEST_ONLY;
  };

  clientId = (): string => this.customizableConfig.clientId || 'Verifier';

  clientIdSchemeName = (): ClientIdSchemeName =>
    this.customizableConfig.clientIdSchemeName || 'pre-registered';

  requestJarOptionName = (): EmbedOptionName =>
    this.customizableConfig.requestJarOptionName || 'by_reference';

  publicUrl = (): string =>
    this.customizableConfig.publicUrl || 'http://localhost:8080';

  responseModeOptionName = (): ResponseModeOptionName =>
    this.customizableConfig.responseModeOptionName || 'direct_post.jwt';

  presentationDefinitionOptionName = (): EmbedOptionName =>
    this.customizableConfig.presentationDefinitionOptionName || 'by_value';

  maxAge = (): Duration =>
    this.customizableConfig.maxAge || DurationLuxon.Factory.ofMinutes(5);
}
