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
  createParseJarmOptionJoseInvoker,
  createParseSigningConfigJoseInvoker,
  createParseStaticSigningPrivateJwkJoseInvoker,
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
  ParseJarmOption,
  ParseSigningConfig,
  ParseStaticSigningPrivateJwk,
  SignRequestObject,
  VerifyJarmJwt,
} from '../ports/out/jose';
import {
  LoadPresentationById,
  LoadPresentationByRequestId,
  StorePresentation,
} from '../ports/out/persistence';
import { PortsOut } from './PortsOut';

/**
 * Implementation of the PortsOut interface.
 * @class PortsOutImpl
 * @implements {PortsOut}
 */
export class PortsOutImpl implements PortsOut {
  /**
   * Creates a function to generate a query wallet response redirect URI.
   * @function
   * @name PortsOutImpl#createQueryWalletResponseRedirectUri
   * @returns {CreateQueryWalletResponseRedirectUri} The CreateQueryWalletResponseRedirectUri component.
   */
  createQueryWalletResponseRedirectUri =
    (): CreateQueryWalletResponseRedirectUri =>
      createCreateQueryWalletResponseRedirectUriInvoker();

  /**
   * Creates a function to generate a duration factory using Luxon.
   * @function
   * @name PortsOutImpl#durationFactory
   * @returns {DurationFactory} The DurationFactory component.
   */
  durationFactory = (): DurationFactory => createDurationFactoryLuxon();

  /**
   * Creates a function to generate a request ID using Hose.
   * @function
   * @name PortsOutImpl#generateRequestId
   * @returns {GenerateRequestId} The GenerateRequestId component.
   */
  generateRequestId = (): GenerateRequestId =>
    createGenerateRequestIdHoseInvoker();

  /**
   * Creates a function to generate a response code.
   * @function
   * @name PortsOutImpl#generateResponseCode
   * @returns {GenerateResponseCode} The GenerateResponseCode component.
   */
  generateResponseCode = (): GenerateResponseCode =>
    createGenerateResponseCodeInvoker();

  /**
   * Creates a function to generate a transaction ID using Jose.
   * @function
   * @name PortsOutImpl#generateTransactionId
   * @returns {GenerateTransactionId} The GenerateTransactionId component.
   */
  generateTransactionId = (): GenerateTransactionId =>
    createGenerateTransactionIdJoseInvoker();

  /**
   * Creates a function to generate an ephemeral ECDH private JWK using Jose.
   * @function
   * @name PortsOutImpl#generateEphemeralECDHPrivateJwk
   * @returns {GenerateEphemeralECDHPrivateJwk} The GenerateEphemeralECDHPrivateJwk component.
   */
  generateEphemeralECDHPrivateJwk = (): GenerateEphemeralECDHPrivateJwk =>
    createGenerateEphemeralECDHPrivateJwkJoseInvoker();

  /**
   * Creates a function to parse a JARM option using Jose.
   * @function
   * @name PortsOutImpl#parseJarmOption
   * @returns {ParseJarmOption} The ParseJarmOption component.
   */
  parseJarmOption = (): ParseJarmOption => createParseJarmOptionJoseInvoker();

  /**
   * Creates a function to parse a signing configuration using Jose.
   * @function
   * @name PortsOutImpl#parseSigningConfig
   * @returns {ParseSigningConfig} The ParseSigningConfig component.
   */
  parseSigningConfig = (): ParseSigningConfig =>
    createParseSigningConfigJoseInvoker();

  /**
   * Creates a function to parse a static signing private JWK using Jose.
   * @function
   * @name PortsOutImpl#parseStaticSigningPrivateJwk
   * @returns {ParseStaticSigningPrivateJwk} The ParseStaticSigningPrivateJwk component.
   */
  parseStaticSigningPrivateJwk = (): ParseStaticSigningPrivateJwk =>
    createParseStaticSigningPrivateJwkJoseInvoker();

  /**
   * Creates a function to sign a request object using Jose.
   * @function
   * @name PortsOutImpl#signRequestObject
   * @returns {SignRequestObject} The SignRequestObject component.
   */
  signRequestObject = (): SignRequestObject =>
    createSignRequestObjectJoseInvoker();

  /**
   * Creates a function to verify a JARM JWT using Jose.
   * @function
   * @name PortsOutImpl#verifyJarmJwt
   * @returns {VerifyJarmJwt} The VerifyJarmJwt component.
   */
  verifyJarmJwt = (): VerifyJarmJwt => createVerifyJarmJwtJoseInvoker();

  /**
   * Creates a function to load a presentation by ID using in-memory storage.
   * @function
   * @name PortsOutImpl#loadPresentationById
   * @returns {LoadPresentationById} The LoadPresentationById component.
   */
  loadPresentationById = (): LoadPresentationById =>
    createLoadPresentationByIdInMemoryInvoker();

  /**
   * Creates a function to load a presentation by request ID using in-memory storage.
   * @function
   * @name PortsOutImpl#loadPresentationByRequestId
   * @returns {LoadPresentationByRequestId} The LoadPresentationByRequestId component.
   */
  loadPresentationByRequestId = (): LoadPresentationByRequestId =>
    createLoadPresentationByIdInMemoryInvoker();

  /**
   * Creates a function to store a presentation using in-memory storage.
   * @function
   * @name PortsOutImpl#storePresentation
   * @returns {StorePresentation} The StorePresentation component.
   */
  storePresentation = (): StorePresentation =>
    createStorePresentationInMemoryInvoker();
}
