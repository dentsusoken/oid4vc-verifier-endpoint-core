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

  abstract jarSigningPrivateJwk(): string;

  abstract clientId(): string;

  abstract clientIdSchemeName(): ClientIdSchemeName;

  abstract publicUrl(): string;

  abstract jarOptionName(): EmbedOptionName;

  abstract responseModeOptionName(): ResponseModeOptionName;

  abstract presentationDefinitionOptionName(): EmbedOptionName;

  abstract maxAge(): Duration;

  transactionIdByteLength = (): number => 64;

  requestIdByteLength = (): number => 64;

  now = () => this.#now;

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

  jarByReference = (): EmbedOption.ByReference<RequestId> =>
    this.#jarByReference;

  jarOption = (): EmbedOption<RequestId> => {
    if (this.jarOptionName() === 'by_value') {
      return EmbedOption.ByValue.INSTANCE;
    }

    return this.jarByReference();
  };

  responseModeOption = (): ResponseModeOption =>
    this.responseModeOptionName() as ResponseModeOption;

  presentationDefinitionByReference = (): EmbedOption.ByReference<RequestId> =>
    this.#presentationDefinitionByReference;

  presentationDefinitionOption = (): EmbedOption<RequestId> => {
    if (this.presentationDefinitionOptionName() === 'by_value') {
      return EmbedOption.ByValue.INSTANCE;
    }

    return this.presentationDefinitionByReference();
  };

  jwkOption = (): EmbedOption<RequestId> => EmbedOption.ByValue.INSTANCE;

  idTokenSignedResponseAlg = (): string | undefined => undefined;

  idTokenEncryptedResponseAlg = (): string | undefined => 'ECDH-ES+A256KW';

  idTokenEncryptedResponseEnc = (): string | undefined => 'A256GCM';

  subjectSyntaxTypesSupported = (): string[] => [
    'urn:ietf:params:oauth:jwk-thumbprint',
  ];

  authorizationSignedResponseAlg = (): string | undefined => undefined;

  authorizationEncryptedResponseAlg = (): string | undefined =>
    'ECDH-ES+A256KW';

  authorizationEncryptedResponseEnc = (): string | undefined => 'A256GCM';

  jarmOption = (): JarmOption =>
    ParseJarmOptionJose.parseJarmOption(
      this.authorizationSignedResponseAlg(),
      this.authorizationEncryptedResponseAlg(),
      this.authorizationEncryptedResponseEnc()
    )!;

  clientMetaData = (): ClientMetaData =>
    new ClientMetaData(
      this.jwkOption(),
      this.idTokenSignedResponseAlg(),
      this.idTokenEncryptedResponseAlg(),
      this.idTokenEncryptedResponseEnc(),
      this.subjectSyntaxTypesSupported(),
      this.jarmOption()
    );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  responseUriBuilder = (): BuildUrl<RequestId> => (_) =>
    new URL(`${this.publicUrl()}/wallet/direct_post`);

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

  async validate() {
    const signingJwk = JSON.parse(this.jarSigningPrivateJwk());
    await importJWK(signingJwk);
  }
}

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
