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
  BuildUrl,
  ClientIdScheme,
  ClientMetaData,
  Duration,
  EmbedOption,
  JarmOption,
  RequestId,
  ResponseModeOption,
  SigningConfig,
  VerifierConfig,
} from '../domain';

export type ClientIdSchemeName =
  | 'pre-registered'
  | 'x509_san_dns'
  | 'x509_san_uri';

export type EmbedOptionName = 'by_value' | 'by_reference';

export type ResponseModeOptionName = `${ResponseModeOption}`;

export interface Configuration {
  transactionIdByteLength(): number;

  requestIdByteLength(): number;

  now(): () => Date;

  jarSigningPrivateJwk(): string;

  jarSigning(): SigningConfig;

  clientId(): string;

  clientIdSchemeName(): ClientIdSchemeName;

  clientIdScheme(): ClientIdScheme;

  publicUrl(): string;

  jarOptionName(): EmbedOptionName;

  jarByReference(): EmbedOption.ByReference<RequestId>;

  jarOption(): EmbedOption<RequestId>;

  responseModeOptionName(): ResponseModeOptionName;

  responseModeOption(): ResponseModeOption;

  presentationDefinitionOptionName(): EmbedOptionName;

  presentationDefinitionByReference(): EmbedOption.ByReference<RequestId>;

  presentationDefinitionOption(): EmbedOption<RequestId>;

  maxAge(): Duration;

  jwkOption(): EmbedOption<RequestId>;

  idTokenSignedResponseAlg(): string | undefined;

  idTokenEncryptedResponseAlg(): string | undefined;

  idTokenEncryptedResponseEnc(): string | undefined;

  subjectSyntaxTypesSupported(): string[];

  authorizationSignedResponseAlg(): string | undefined;

  authorizationEncryptedResponseAlg(): string | undefined;

  authorizationEncryptedResponseEnc(): string | undefined;

  jarmOption(): JarmOption;

  clientMetaData(): ClientMetaData;

  responseUriBuilder(): BuildUrl<RequestId>;

  verifierConfig(): VerifierConfig;
}
