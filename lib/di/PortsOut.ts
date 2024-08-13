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

/**
 * Interface representing the output ports of the system.
 * @interface PortsOut
 */
export interface PortsOut {
  /**
   * Creates a function to generate a query wallet response redirect URI.
   * @function
   * @name PortsOut#createQueryWalletResponseRedirectUri
   * @returns {CreateQueryWalletResponseRedirectUri} The CreateQueryWalletResponseRedirectUri component.
   */
  createQueryWalletResponseRedirectUri(): CreateQueryWalletResponseRedirectUri;

  /**
   * Creates a function to generate a duration factory.
   * @function
   * @name PortsOut#durationFactory
   * @returns {DurationFactory} The DurationFactory component.
   */
  durationFactory(): DurationFactory;

  /**
   * Creates a function to generate a request ID.
   * @function
   * @name PortsOut#generateRequestId
   * @returns {GenerateRequestId} The GenerateRequestId component.
   */
  generateRequestId(): GenerateRequestId;

  /**
   * Creates a function to generate a response code.
   * @function
   * @name PortsOut#generateResponseCode
   * @returns {GenerateResponseCode} The GenerateResponseCode component.
   */
  generateResponseCode(): GenerateResponseCode;

  /**
   * Creates a function to generate a transaction ID.
   * @function
   * @name PortsOut#generateTransactionId
   * @returns {GenerateTransactionId} The GenerateTransactionId component.
   */
  generateTransactionId(): GenerateTransactionId;

  /**
   * Creates a function to generate an ephemeral ECDH private JWK.
   * @function
   * @name PortsOut#generateEphemeralECDHPrivateJwk
   * @returns {GenerateEphemeralECDHPrivateJwk} The GenerateEphemeralECDHPrivateJwk component.
   */
  generateEphemeralECDHPrivateJwk(): GenerateEphemeralECDHPrivateJwk;

  /**
   * Creates a function to parse a JARM option.
   * @function
   * @name PortsOut#parseJarmOption
   * @returns {ParseJarmOption} The ParseJarmOption component.
   */
  parseJarmOption(): ParseJarmOption;

  /**
   * Creates a function to parse a signing configuration.
   * @function
   * @name PortsOut#parseSigningConfig
   * @returns {ParseSigningConfig} The ParseSigningConfig component.
   */
  parseSigningConfig(): ParseSigningConfig;

  /**
   * Creates a function to parse a static signing private JWK.
   * @function
   * @name PortsOut#parseStaticSigningPrivateJwk
   * @returns {ParseStaticSigningPrivateJwk} The ParseStaticSigningPrivateJwk component.
   */
  parseStaticSigningPrivateJwk(): ParseStaticSigningPrivateJwk;

  /**
   * Creates a function to sign a request object.
   * @function
   * @name PortsOut#signRequestObject
   * @returns {SignRequestObject} The SignRequestObject component.
   */
  signRequestObject(): SignRequestObject;

  /**
   * Creates a function to verify a JARM JWT.
   * @function
   * @name PortsOut#verifyJarmJwt
   * @returns {VerifyJarmJwt} The VerifyJarmJwt component.
   */
  verifyJarmJwt(): VerifyJarmJwt;

  /**
   * Creates a function to load a presentation by ID.
   * @function
   * @name PortsOut#loadPresentationById
   * @returns {LoadPresentationById} The LoadPresentationById component.
   */
  loadPresentationById(): LoadPresentationById;

  /**
   * Creates a function to load a presentation by request ID.
   * @function
   * @name PortsOut#loadPresentationByRequestId
   * @returns {LoadPresentationByRequestId} The LoadPresentationByRequestId component.
   */
  loadPresentationByRequestId(): LoadPresentationByRequestId;

  /**
   * Creates a function to store a presentation.
   * @function
   * @name PortsOut#storePresentation
   * @returns {StorePresentation} The StorePresentation component.
   */
  storePresentation(): StorePresentation;
}
