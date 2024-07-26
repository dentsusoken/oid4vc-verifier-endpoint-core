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
import { Expose } from 'class-transformer';
import { PresentationSubmission } from '../../../mock/prex';
import {
  Presentation,
  ResponseCode,
  TransactionId,
  WalletResponse,
} from '../../domain';
import { QueryResponse } from './QueryResponse';
import { LoadPresentationById } from '../out/persistence';

@Expose({ name: 'wallet_response' })
export class WalletResponseTO {
  @Expose({ name: 'id_token' }) idToken?: string;
  @Expose({ name: 'vp_token' }) vpToken?: string;
  @Expose({ name: 'presentation_submission' })
  presentationSubmission?: PresentationSubmission;
  @Expose({ name: 'error' }) error?: string;
  @Expose({ name: 'error_description' }) errorDescription?: string;

  constructor(args: {
    idToken?: string;
    vpToken?: string;
    presentationSubmission?: PresentationSubmission;
    error?: string;
    errorDescription?: string;
  }) {
    this.idToken = args.idToken;
    this.vpToken = args.vpToken;
    this.presentationSubmission = args.presentationSubmission;
    this.error = args.error;
    this.errorDescription = args.errorDescription;
  }
}

export const toTo = (instance: WalletResponse): WalletResponseTO => {
  if (instance instanceof WalletResponse.IdToken) {
    return new WalletResponseTO({ idToken: instance.idToken });
  }
  if (instance instanceof WalletResponse.VpToken) {
    return new WalletResponseTO({
      vpToken: instance.vpToken,
      presentationSubmission: instance.presentationSubmission,
    });
  }
  if (instance instanceof WalletResponse.IdAndVpToken) {
    return new WalletResponseTO({
      idToken: instance.idToken,
      vpToken: instance.vpToken,
      presentationSubmission: instance.presentationSubmission,
    });
  }
  if (instance instanceof WalletResponse.Error) {
    return new WalletResponseTO({
      error: instance.value,
      errorDescription: instance.description,
    });
  }
  throw new Error('Unsupported WalletResponse');
};

interface GetWalletResponse {
  invoke(
    transactionId: TransactionId,
    responseCode?: ResponseCode
  ): Promise<QueryResponse<WalletResponseTO>>;
}

export class GetWalletResponseLive implements GetWalletResponse {
  constructor(private loadPresentationById: LoadPresentationById) {}

  async invoke(
    transactionId: TransactionId,
    responseCode?: ResponseCode
  ): Promise<QueryResponse<WalletResponseTO>> {
    const presentation = await this.loadPresentationById(transactionId);

    switch (presentation instanceof Presentation.Submitted) {
      case true:
        const presentationResCode = (presentation as Presentation.Submitted)
          .responseCode;

        if (
          (!presentationResCode && !!responseCode) ||
          (!!presentationResCode && !responseCode)
        ) {
          return QueryResponse.InvalidState;
        } else if (
          (!presentationResCode && !responseCode) ||
          presentationResCode?.value === responseCode?.value
        ) {
          return new QueryResponse.Found(
            toTo((presentation as Presentation.Submitted).walletResponse)
          );
        } else {
          return QueryResponse.InvalidState;
        }
      default:
        switch (presentation) {
          case undefined:
            return QueryResponse.NotFound;
          default:
            return QueryResponse.InvalidState;
        }
    }
  }
}
