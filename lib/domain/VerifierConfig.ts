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
import { Duration, runCatching } from '..';
import {
  DefaultJWSSignerFactory,
  JWK,
  JWSAlgorithm,
  X509Certificate as X509CertificateDefault,
} from '../../mock/crypto';
import { RequestId } from './Presentation';

export type PresentationRelatedUrlBuilder<ID> = (id: ID) => URL;

// eslint-disable-next-line no-unused-vars
export interface EmbedOption<ID> {}

export namespace EmbedOption {
  export class ByValue implements EmbedOption<unknown> {}

  export class ByReference<ID> implements EmbedOption<ID> {
    constructor(public buildUrl: PresentationRelatedUrlBuilder<ID>) {}
  }
  export const byReference = <ID>(
    buildUrl: PresentationRelatedUrlBuilder<ID>
  ): ByReference<ID> => new ByReference(buildUrl);
}

export enum ResponseModeOption {
  DirectPost,
  DirectPostJwt,
}

export interface JarmOption {
  jwsAlg(): string | undefined;
  jweAlg(): string | undefined;
  encryptionMethod(): string | undefined;
}

export namespace JarmOption {
  export class Signed implements JarmOption {
    constructor(public algorithm: string) {}

    jwsAlg(): string | undefined {
      return this.algorithm;
    }
    jweAlg(): string | undefined {
      return undefined;
    }
    encryptionMethod(): string | undefined {
      return undefined;
    }
  }

  export class Encrypted implements JarmOption {
    constructor(public algorithm: string, public encode: string) {}

    jwsAlg(): string | undefined {
      return undefined;
    }
    jweAlg(): string | undefined {
      return this.algorithm;
    }
    encryptionMethod(): string | undefined {
      return this.encode;
    }
  }

  export class SignedAndEncrypted implements JarmOption {
    constructor(public signed: Signed, public encrypted: Encrypted) {}

    jwsAlg(): string | undefined {
      return this.signed.algorithm;
    }
    jweAlg(): string | undefined {
      return this.encrypted.algorithm;
    }
    encryptionMethod(): string | undefined {
      return this.encrypted.encode;
    }
  }
}

export class ClientMetaData {
  constructor(
    public jwkOption: EmbedOption<RequestId>,
    public idTokenSignedResponseAlg: string,
    public idTokenEncryptedResponseAlg: string,
    public idTokenEncryptedResponseEnc: string,
    public subjectSyntaxTypesSupported: string[],
    public jarmOption: JarmOption
  ) {}
}

export class SigningConfig {
  constructor(public key: JWK, public algorithm: JWSAlgorithm) {
    if (JWSAlgorithm.Family.SIGNATURE.includes(algorithm)) {
      throw new Error(`'${algorithm.name}' is not a valid signature algorithm`);
    }

    const result = runCatching(() =>
      new DefaultJWSSignerFactory().createJWSSigner(key, algorithm)
    );

    if (typeof result.getOrNull === 'undefined') {
      throw new Error('Invalid configuration');
    }
  }

  certificate(): X509Certificate {
    return this.key.parsedX509CertChain[0];
  }
}

export interface ClientIdScheme {
  clientId: string;
  jarSigning: SigningConfig;
  name: string;
}

export namespace ClientIdScheme {
  export class PreRegistered implements ClientIdScheme {
    public name: string;
    constructor(public clientId: string, public jarSigning: SigningConfig) {
      this.name = 'pre-registered';
    }
  }

  export class X509SanDns implements ClientIdScheme {
    public name: string;
    constructor(public clientId: string, public jarSigning: SigningConfig) {
      if (!jarSigning.certificate().containsSanDns(clientId)) {
        throw new Error(
          `Client Id '${clientId}' not contained in 'DNS' Subject Alternative Names of JAR Signing Certificate.`
        );
      }

      this.name = 'x509_san_dns';
    }
  }

  export class X509SanUri implements ClientIdScheme {
    public name: string;
    constructor(public clientId: string, public jarSigning: SigningConfig) {
      if (!jarSigning.certificate().containsSanUri(clientId)) {
        throw new Error(
          `Client Id '${clientId}' not contained in 'URI' Subject Alternative Names of JAR Signing Certificate.`
        );
      }

      this.name = 'x509_san_uri';
    }
  }
}

export class VerifierConfig {
  constructor(
    public clientIdScheme: ClientIdScheme,
    public requestJarOption: EmbedOption<RequestId>,
    public presentationDefinitionEmbedOption: EmbedOption<RequestId>,
    public responseModeOption: ResponseModeOption,
    public responseUriBuilder: PresentationRelatedUrlBuilder<RequestId>,
    public maxAge: Duration,
    public clientMetaData: ClientMetaData
  ) {}
}

class X509Certificate extends X509CertificateDefault {
  containsSan(value: string, type: SanType) {
    return this.san(type).includes(value);
  }
  containsSanDns(value: string) {
    return this.containsSan(value, SanType.DNS);
  }
  containsSanUri(value: string) {
    return this.containsSan(value, SanType.URI);
  }
  san(type: SanType): string[] {
    const list: string[] = [];
    X509Certificate.subjectAlternativeNames
      ?.filter(
        (subjectAltNames) => !!subjectAltNames && subjectAltNames.length == 2
      )
      ?.forEach((entry) => {
        const altNameType = entry[0] as number;
        if (altNameType === type.asInt()) {
          list.push(entry[1] as string);
        }
      });
    return list;
  }
}

class SanType {
  #value: number;
  static URI = new SanType(6);
  static DNS = new SanType(2);

  private constructor(value: number) {
    this.#value = value;
  }

  asInt() {
    return this.#value;
  }
}
