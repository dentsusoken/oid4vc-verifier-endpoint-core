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

import { AuthorizationResponse, VerifierConfig } from '../../domain';
import {
  CreateQueryWalletResponseRedirectUri,
  GenerateResponseCode,
} from '../../ports/out/cfg';
import { VerifyJarmJwt } from '../../ports/out/jose';
import {
  LoadPresentationByRequestId,
  StorePresentation,
} from '../../ports/out/persistence';
import { PostWalletResponse } from '../../ports/input/PostWalletResponse';
import { WalletResponseAcceptedTO } from '../../ports/input/PostWalletResponse.types';
import { runAsyncCatching, Result } from '../../kotlin';
import {
  getRequestId,
  getReponseModeOption,
  toAuthorizationResponseData,
  toWalletResponse,
} from './PostWalletResponseService.convert';
import {
  createResponseCode,
  createWalletResponseAcceptedTO,
} from './PostWalletResponseService.create';

type CreateParams = {
  loadPresentationByRequestId: LoadPresentationByRequestId;
  storePresentation: StorePresentation;
  verifyJarmJwt: VerifyJarmJwt;
  now: () => Date;
  verifierConfig: VerifierConfig;
  generateResponseCode: GenerateResponseCode;
  createQueryWalletResponseRedirectUri: CreateQueryWalletResponseRedirectUri;
};

export const createPostWalletResponseServiceInvoker =
  ({
    loadPresentationByRequestId,
    storePresentation,
    verifyJarmJwt,
    now,
    verifierConfig,
    generateResponseCode,
    createQueryWalletResponseRedirectUri,
  }: CreateParams): PostWalletResponse =>
  (
    authorizationResponse: AuthorizationResponse
  ): Promise<Result<WalletResponseAcceptedTO | undefined>> =>
    runAsyncCatching(async () => {
      const requestId = await getRequestId(authorizationResponse);
      const presentation = await loadPresentationByRequestId(requestId);

      if (!presentation) {
        throw new Error('Not found presentation');
      }

      if (presentation.__type !== 'RequestObjectRetrieved') {
        throw new Error('Invalid presentation status');
      }

      if (
        presentation.responseMode !==
        getReponseModeOption(authorizationResponse)
      ) {
        throw new Error('Unexpected response mode');
      }

      const authorizationResponseData = await toAuthorizationResponseData(
        authorizationResponse,
        verifyJarmJwt,
        verifierConfig.clientMetaData.jarmOption,
        presentation.ephemeralECDHPrivateJwk
      );
      const walletResponse = await toWalletResponse(
        authorizationResponseData,
        presentation.type
      );
      const responseCode = await createResponseCode(
        presentation.getWalletResponseMethod,
        generateResponseCode
      );
      const submitted = presentation
        .submit(now(), walletResponse, responseCode)
        .getOrThrow();
      await storePresentation(submitted);

      return createWalletResponseAcceptedTO(
        presentation.getWalletResponseMethod,
        createQueryWalletResponseRedirectUri,
        responseCode
      );
    });
