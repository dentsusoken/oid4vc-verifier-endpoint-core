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
  GetRequestObject,
  GetWalletResponse,
  InitTransaction,
  PostWalletResponse,
} from '../ports/input';
import {
  createGetWalletResponseInvoker,
  createInitTransactionServiceInvoker,
} from '../services/input';
import { Configuration } from './Configuration';
import { PortsOut } from './PortsOut';
import { PortsInput } from './PortsInput';
import { createGetRequestObjectServiceInvoker } from '../services/input/GetRequestObjectService';
import { createPostWalletResponseServiceInvoker } from '../services/input/PostWalletResponseService';

export class PortsInputImpl implements PortsInput {
  #initTransaction: InitTransaction;

  #getRequestObject: GetRequestObject;

  #postWalletResponse: PostWalletResponse;

  #getWalletResponse: GetWalletResponse;

  constructor(
    private configuration: Configuration,
    private portsOut: PortsOut
  ) {
    this.#initTransaction = createInitTransactionServiceInvoker({
      generateTransactionId: this.portsOut.generateTransactionId(),
      generateRequestId: this.portsOut.generateRequestId(),
      storePresentation: this.portsOut.storePresentation(),
      signRequestObject: this.portsOut.signRequestObject(),
      verifierConfig: this.configuration.verifierConfig(),
      now: this.configuration.now(),
      generateEphemeralECDHPrivateJwk:
        this.portsOut.generateEphemeralECDHPrivateJwk(),
      jarByReference: this.configuration.jarByReference(),
      presentationDefinitionByReference:
        this.configuration.presentationDefinitionByReference(),
      createQueryWalletResponseRedirectUri:
        this.portsOut.createQueryWalletResponseRedirectUri(),
    });

    this.#getRequestObject = createGetRequestObjectServiceInvoker({
      loadPresentationByRequestId: this.portsOut.loadPresentationByRequestId(),
      storePresentation: this.portsOut.storePresentation(),
      signRequestObject: this.portsOut.signRequestObject(),
      verifierConfig: this.configuration.verifierConfig(),
      now: this.configuration.now(),
    });

    this.#postWalletResponse = createPostWalletResponseServiceInvoker({
      loadPresentationByRequestId: this.portsOut.loadPresentationByRequestId(),
      storePresentation: this.portsOut.storePresentation(),
      verifyJarmJwt: this.portsOut.verifyJarmJwt(),
      now: this.configuration.now(),
      verifierConfig: this.configuration.verifierConfig(),
      generateResponseCode: this.portsOut.generateResponseCode(),
      createQueryWalletResponseRedirectUri:
        this.portsOut.createQueryWalletResponseRedirectUri(),
    });

    this.#getWalletResponse = createGetWalletResponseInvoker({
      loadPresentationById: this.portsOut.loadPresentationById(),
      now: this.configuration.now(),
      maxAge: this.configuration.maxAge(),
    });
  }

  initTransaction = (): InitTransaction => this.#initTransaction;

  getRequestObject = (): GetRequestObject => this.#getRequestObject;

  postWalletResponse = (): PostWalletResponse => this.#postWalletResponse;

  getWalletResponse = (): GetWalletResponse => this.#getWalletResponse;
}
