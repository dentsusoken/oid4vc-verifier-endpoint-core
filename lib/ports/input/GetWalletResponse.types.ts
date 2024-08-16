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
import { Expose, Type, Transform, instanceToPlain } from 'class-transformer';
import { PresentationSubmission } from 'oid4vc-prex';

/**
 * Represents a Wallet Response Transfer Object.
 * This class encapsulates the response data from a wallet, including tokens, presentation submission, and error information.
 */
export class WalletResponseTO {
  /**
   * The ID token returned by the wallet.
   * @type {string|undefined}
   */
  @Expose({ name: 'id_token' })
  idToken?: string;

  /**
   * The Verifiable Presentation token returned by the wallet.
   * @type {string|undefined}
   */
  @Expose({ name: 'vp_token' })
  vpToken?: string;

  /**
   * The Presentation Submission object associated with the response.
   * @type {PresentationSubmission|undefined}
   */
  @Expose({ name: 'presentation_submission' })
  @Type(() => PresentationSubmission)
  @Transform(
    ({ value }) => value && PresentationSubmission.deserialize(value),
    { toClassOnly: true }
  )
  @Transform(({ value }) => value && value.serialize(), { toPlainOnly: true })
  presentationSubmission?: PresentationSubmission;

  /**
   * Error code, if an error occurred during the wallet operation.
   * @type {string|undefined}
   */
  @Expose({ name: 'error' })
  error?: string;

  /**
   * Detailed description of the error, if an error occurred.
   * @type {string|undefined}
   */
  @Expose({ name: 'error_description' })
  errorDescription?: string;

  /**
   * Creates an instance of WalletResponseTO.
   * @constructor
   * @param {Object} [args] - The initialization arguments.
   * @param {string} [args.idToken] - The ID token.
   * @param {string} [args.vpToken] - The Verifiable Presentation token.
   * @param {PresentationSubmission} [args.presentationSubmission] - The Presentation Submission object.
   * @param {string} [args.error] - The error code.
   * @param {string} [args.errorDescription] - The error description.
   */
  constructor(args?: {
    idToken?: string;
    vpToken?: string;
    presentationSubmission?: PresentationSubmission;
    error?: string;
    errorDescription?: string;
  }) {
    if (!args) {
      return;
    }

    this.idToken = args.idToken;
    this.vpToken = args.vpToken;
    this.presentationSubmission = args.presentationSubmission;
    this.error = args.error;
    this.errorDescription = args.errorDescription;
  }

  serialize(): Record<string, unknown> {
    return instanceToPlain(this);
  }
}
