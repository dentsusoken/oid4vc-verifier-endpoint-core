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
import { z } from 'zod';
import { PresentationSubmission, presentationSubmissionSchema } from 'oid4vc-prex';
import { FromJSON } from '../../common/json/FromJSON';

export const walletResponseScheme = z
  .object({
    id_token: z.string().optional(),
    vp_token: z.string().optional(),
    presentation_submission: presentationSubmissionSchema.optional(),
    error: z.string().optional(),
    error_description: z.string().optional()
  });

export type WalletResponseJSON = z.infer<
  typeof walletResponseScheme
>;

export class WalletResponseTO {
  idToken?: string;
  vpToken?: string;
  presentationSubmission?: PresentationSubmission;
  error?: string;
  errorDescription?: string;

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

  toJSON(): WalletResponseJSON {
    return {
      id_token: this.idToken,
      vp_token: this.vpToken,
      presentation_submission: this.presentationSubmission?.toJSON(),
      error: this.error,
      error_description: this.errorDescription,
    };
  }

  static fromJSON: FromJSON<WalletResponseJSON, WalletResponseTO> = (json) => {
    return new WalletResponseTO({
      idToken: json.id_token,
      vpToken: json.vp_token,
      presentationSubmission: PresentationSubmission.fromJSON(
        json.presentation_submission
      ),
      error: json.error,
      errorDescription: json.error_description,
    });
  };
}