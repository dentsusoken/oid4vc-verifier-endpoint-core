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
  createCreateQueryWalletResponseRedirectUriInvoker,
  createDurationFactoryLuxon,
  createGenerateRequestIdHoseInvoker,
  createGenerateResponseCodeInvoker,
  createGenerateTransactionIdJoseInvoker,
} from '../adapters/out/cfg';
import {
  createGenerateEphemeralECDHPrivateJwkJoseInvoker,
  createSignRequestObjectJoseInvoker,
  createVerifyJarmJwtJoseInvoker,
} from '../adapters/out/jose';
import {
  createLoadPresentationByIdInMemoryInvoker,
  createStorePresentationInMemoryInvoker,
} from '../adapters/out/persistence';
import {
  CreateQueryWalletResponseRedirectUri,
  DurationFactory,
  GenerateRequestId,
  GenerateResponseCode,
  GenerateTransactionId,
} from '../ports/out/cfg';
import {
  GenerateEphemeralECDHPrivateJwk,
  SignRequestObject,
  VerifyJarmJwt,
} from '../ports/out/jose';
import {
  LoadPresentationById,
  LoadPresentationByRequestId,
  StorePresentation,
} from '../ports/out/persistence';
import { Configuration } from './Configuration';
import { PortsOut } from './PortsOut';

/**
 * Implementation of the PortsOut interface.
 * @class PortsOutImpl
 * @implements {PortsOut}
 */
export class PortsOutImpl implements PortsOut {
  #createQueryWalletResponseRedirectUri =
    createCreateQueryWalletResponseRedirectUriInvoker();

  #durationFactory = createDurationFactoryLuxon();

  #generateRequestId: GenerateRequestId;

  #generateResponseCode = createGenerateResponseCodeInvoker();

  #generateTransactionId: GenerateTransactionId;

  #generateEphemeralECDHPrivateJwk =
    createGenerateEphemeralECDHPrivateJwkJoseInvoker();

  #signRequestObject = createSignRequestObjectJoseInvoker();

  #verifyJarmJwt = createVerifyJarmJwtJoseInvoker();

  #loadPresentationById = createLoadPresentationByIdInMemoryInvoker();

  #loadPresentationByRequestId = createLoadPresentationByIdInMemoryInvoker();

  #storePresentation = createStorePresentationInMemoryInvoker();

  constructor(private configuration: Configuration) {
    this.#generateRequestId = createGenerateRequestIdHoseInvoker(
      this.configuration.requestIdByteLength()
    );

    this.#generateTransactionId = createGenerateTransactionIdJoseInvoker(
      this.configuration.transactionIdByteLength()
    );
  }
  /**
   * Creates a function to generate a query wallet response redirect URI.
   * @function
   * @name PortsOutImpl#createQueryWalletResponseRedirectUri
   * @returns {CreateQueryWalletResponseRedirectUri} The CreateQueryWalletResponseRedirectUri component.
   */
  createQueryWalletResponseRedirectUri =
    (): CreateQueryWalletResponseRedirectUri =>
      this.#createQueryWalletResponseRedirectUri;

  /**
   * Creates a function to generate a duration factory using Luxon.
   * @function
   * @name PortsOutImpl#durationFactory
   * @returns {DurationFactory} The DurationFactory component.
   */
  durationFactory = (): DurationFactory => this.#durationFactory;

  /**
   * Creates a function to generate a request ID using Hose.
   * @function
   * @name PortsOutImpl#generateRequestId
   * @returns {GenerateRequestId} The GenerateRequestId component.
   */
  generateRequestId = (): GenerateRequestId => this.#generateRequestId;

  /**
   * Creates a function to generate a response code.
   * @function
   * @name PortsOutImpl#generateResponseCode
   * @returns {GenerateResponseCode} The GenerateResponseCode component.
   */
  generateResponseCode = (): GenerateResponseCode => this.#generateResponseCode;

  /**
   * Creates a function to generate a transaction ID using Jose.
   * @function
   * @name PortsOutImpl#generateTransactionId
   * @returns {GenerateTransactionId} The GenerateTransactionId component.
   */
  generateTransactionId = (): GenerateTransactionId =>
    this.#generateTransactionId;

  /**
   * Creates a function to generate an ephemeral ECDH private JWK using Jose.
   * @function
   * @name PortsOutImpl#generateEphemeralECDHPrivateJwk
   * @returns {GenerateEphemeralECDHPrivateJwk} The GenerateEphemeralECDHPrivateJwk component.
   */
  generateEphemeralECDHPrivateJwk = (): GenerateEphemeralECDHPrivateJwk =>
    this.#generateEphemeralECDHPrivateJwk;

  /**
   * Creates a function to sign a request object using Jose.
   * @function
   * @name PortsOutImpl#signRequestObject
   * @returns {SignRequestObject} The SignRequestObject component.
   */
  signRequestObject = (): SignRequestObject => this.#signRequestObject;

  /**
   * Creates a function to verify a JARM JWT using Jose.
   * @function
   * @name PortsOutImpl#verifyJarmJwt
   * @returns {VerifyJarmJwt} The VerifyJarmJwt component.
   */
  verifyJarmJwt = (): VerifyJarmJwt => this.#verifyJarmJwt;

  /**
   * Creates a function to load a presentation by ID using in-memory storage.
   * @function
   * @name PortsOutImpl#loadPresentationById
   * @returns {LoadPresentationById} The LoadPresentationById component.
   */
  loadPresentationById = (): LoadPresentationById => this.#loadPresentationById;

  /**
   * Creates a function to load a presentation by request ID using in-memory storage.
   * @function
   * @name PortsOutImpl#loadPresentationByRequestId
   * @returns {LoadPresentationByRequestId} The LoadPresentationByRequestId component.
   */
  loadPresentationByRequestId = (): LoadPresentationByRequestId =>
    this.#loadPresentationByRequestId;

  /**
   * Creates a function to store a presentation using in-memory storage.
   * @function
   * @name PortsOutImpl#storePresentation
   * @returns {StorePresentation} The StorePresentation component.
   */
  storePresentation = (): StorePresentation => this.#storePresentation;
}
