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
  EmbedOption,
  RequestId,
  VerifierConfig,
  Presentation,
} from '../../domain';
import {
  GenerateTransactionId,
  GenerateRequestId,
  Now,
  CreateQueryWalletResponseRedirectUri,
} from '../../ports/out/cfg';
import {
  SignRequestObject,
  GenerateEphemeralECDHPrivateJwk,
} from '../../ports/out/jose';
import { StorePresentation } from '../../ports/out/persistence';
import { InitTransaction } from '../../ports/input';
import {
  InitTransactionTO,
  JwtSecuredAuthorizationRequestTO,
} from '../../ports/input/InitTransaction.types';
import { Result, runAsyncCatching } from '../../kotlin';
import {
  toEmbedOption,
  toGetWalletResponseMethod,
  toIdTokenTypes,
  toNonce,
  toPresentationType,
  toResponseModeOption,
} from './InitTransactionService.convert';
import {
  createEphemeralECDHPrivateJwk,
  createJwtSecuredAuthorizationRequestTO,
} from './InitTransactionService.create';

type CreateParams = {
  generateTransactionId: GenerateTransactionId;
  generateRequestId: GenerateRequestId;
  storePresentation: StorePresentation;
  signRequestObject: SignRequestObject;
  verifierConfig: VerifierConfig;
  now: Now;
  generateEphemeralECDHPrivateJwk: GenerateEphemeralECDHPrivateJwk;
  jarByReference: EmbedOption.ByReference<RequestId>;
  presentationDefinitionByReference: EmbedOption.ByReference<RequestId>;
  createQueryWalletResponseRedirectUri: CreateQueryWalletResponseRedirectUri;
};

export const createInitTransactionServiceInvoker =
  ({
    generateTransactionId,
    generateRequestId,
    storePresentation,
    signRequestObject,
    verifierConfig,
    now,
    generateEphemeralECDHPrivateJwk,
    jarByReference,
    presentationDefinitionByReference,
    createQueryWalletResponseRedirectUri,
  }: CreateParams): InitTransaction =>
  (
    initTransactionTO: InitTransactionTO
  ): Promise<Result<JwtSecuredAuthorizationRequestTO>> =>
    runAsyncCatching(async () => {
      const idTokenTypes = toIdTokenTypes(initTransactionTO.idTokenType);
      const type = toPresentationType(
        initTransactionTO.type,
        idTokenTypes,
        initTransactionTO.presentationDefinition
      );
      const nonce = toNonce(initTransactionTO.nonce);
      const responseMode = toResponseModeOption(
        initTransactionTO.responseMode,
        verifierConfig.responseModeOption
      );
      const ephemeralECDHPrivateJwk = await createEphemeralECDHPrivateJwk(
        responseMode,
        verifierConfig.clientMetaData.jarmOption,
        generateEphemeralECDHPrivateJwk
      );
      const getWalletResponseMethod = toGetWalletResponseMethod(
        initTransactionTO.redirectUriTemplate,
        createQueryWalletResponseRedirectUri
      );
      const presentationDefinitionMode = toEmbedOption(
        initTransactionTO.presentationDefinitionMode,
        presentationDefinitionByReference,
        verifierConfig.presentationDefinitionEmbedOption
      );
      const jarMode = toEmbedOption(
        initTransactionTO.jarMode,
        jarByReference,
        verifierConfig.requestJarOption
      );

      const id = (await generateTransactionId()).getOrThrow();
      const initiatedAt = now();
      const requestId = (await generateRequestId()).getOrThrow();

      const requested = new Presentation.Requested(
        id,
        initiatedAt,
        type,
        requestId,
        nonce,
        ephemeralECDHPrivateJwk,
        responseMode,
        presentationDefinitionMode,
        getWalletResponseMethod
      );
      const { requestTO, presentation } =
        await createJwtSecuredAuthorizationRequestTO(
          requested,
          jarMode,
          signRequestObject,
          verifierConfig,
          now
        );

      await storePresentation(presentation);

      return requestTO;
    });