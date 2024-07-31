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
import { Expose, Transform } from 'class-transformer';
import { PresentationDefinition } from '../../../mock/prex';

type PresentationTypeTOValue = 'id_token' | 'vp_token' | 'vp_token id_token';

export enum PresentationTypeTO {
  IdTokenRequest,
  VpTokenRequest,
  IdAndVpTokenRequest,
}

export namespace PresentationTypeTO {
  export const toString = (
    value: PresentationTypeTO
  ): PresentationTypeTOValue => {
    switch (value) {
      case PresentationTypeTO.IdTokenRequest:
        return 'id_token';
      case PresentationTypeTO.VpTokenRequest:
        return 'vp_token';
      case PresentationTypeTO.IdAndVpTokenRequest:
        return 'vp_token id_token';
      default:
        throw new Error(`Unsupported PresentationTypeTO: ${value}`);
    }
  };

  export const fromString = (
    value: PresentationTypeTOValue
  ): PresentationTypeTO => {
    switch (value) {
      case 'id_token':
        return PresentationTypeTO.IdTokenRequest;
      case 'vp_token':
        return PresentationTypeTO.VpTokenRequest;
      case 'vp_token id_token':
        return PresentationTypeTO.IdAndVpTokenRequest;
      default:
        throw new Error(`Unsupported PresentationTypeTO: ${value}`);
    }
  };
}

type IdTokenTypeTOValue =
  | 'subject_signed_id_token'
  | 'attester_signed_id_token';

export enum IdTokenTypeTO {
  SubjectSigned,
  AttesterSigned,
}

export namespace IdTokenTypeTO {
  export const toString = (value: IdTokenTypeTO): IdTokenTypeTOValue => {
    switch (value) {
      case IdTokenTypeTO.SubjectSigned:
        return 'subject_signed_id_token';
      case IdTokenTypeTO.AttesterSigned:
        return 'attester_signed_id_token';
      default:
        throw new Error(`Unsupported IdTokenTypeTO: ${value}`);
    }
  };

  export const fromString = (value: IdTokenTypeTOValue): IdTokenTypeTO => {
    switch (value) {
      case 'subject_signed_id_token':
        return IdTokenTypeTO.SubjectSigned;
      case 'attester_signed_id_token':
        return IdTokenTypeTO.AttesterSigned;
      default:
        throw new Error(`Unsupported IdTokenTypeTO: ${value}`);
    }
  };
}

type ResponseModeTOValue = 'direct_post' | 'direct_post.jwt';

export enum ResponseModeTO {
  DirectPost,
  DirectPostJwt,
}

export namespace ResponseModeTO {
  export const toString = (value: ResponseModeTO): ResponseModeTOValue => {
    switch (value) {
      case ResponseModeTO.DirectPost:
        return 'direct_post';
      case ResponseModeTO.DirectPostJwt:
        return 'direct_post.jwt';
      default:
        throw new Error(`Unsupported ResponseModeTO: ${value}`);
    }
  };

  export const fromString = (value: ResponseModeTOValue): ResponseModeTO => {
    switch (value) {
      case 'direct_post':
        return ResponseModeTO.DirectPost;
      case 'direct_post.jwt':
        return ResponseModeTO.DirectPostJwt;
      default:
        throw new Error(`Unsupported ResponseModeTO: ${value}`);
    }
  };
}

type EmbedModeTOValue = 'by_value' | 'by_reference';

export enum EmbedModeTO {
  ByValue,
  ByReference,
}

export namespace EmbedModeTO {
  export const toString = (value: EmbedModeTO): EmbedModeTOValue => {
    switch (value) {
      case EmbedModeTO.ByValue:
        return 'by_value';
      case EmbedModeTO.ByReference:
        return 'by_reference';
      default:
        throw new Error(`Unsupported EmbedModeTO: ${value}`);
    }
  };

  export const fromString = (value: EmbedModeTOValue): EmbedModeTO => {
    switch (value) {
      case 'by_value':
        return EmbedModeTO.ByValue;
      case 'by_reference':
        return EmbedModeTO.ByReference;
      default:
        throw new Error(`Unsupported EmbedModeTO: ${value}`);
    }
  };
}

export class InitTransactionTO {
  @Expose({ name: 'type' })
  @Transform(({ value }) => PresentationTypeTO.toString(value), {
    toPlainOnly: true,
  })
  @Transform(({ value }) => PresentationTypeTO.fromString(value), {
    toClassOnly: true,
  })
  type: PresentationTypeTO = PresentationTypeTO.IdAndVpTokenRequest;
  idTokenType?: IdTokenTypeTO;
  presentationDefinition?: PresentationDefinition;
  nonce?: string;
  responseMode?: ResponseModeTO;
  jarMode?: EmbedModeTO;
  presentationDefinitionMode?: EmbedModeTO;
  redirectUriTemplate?: string;

  constructor(
    type: PresentationTypeTO = PresentationTypeTO.IdAndVpTokenRequest,
    idTokenType?: IdTokenTypeTO,
    presentationDefinition?: PresentationDefinition,
    nonce?: string,
    responseMode?: ResponseModeTO,
    jarMode?: EmbedModeTO,
    presentationDefinitionMode?: EmbedModeTO,
    redirectUriTemplate?: string
  ) {}
}
