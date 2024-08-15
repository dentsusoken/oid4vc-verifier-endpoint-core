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
import { ResponseCode, TransactionId } from '../../domain';
import { QueryResponse } from './QueryResponse';
import { WalletResponseTO } from './GetWalletResponse.types';

export { WalletResponseTO } from './GetWalletResponse.types';
/**
 * Represents a function to retrieve a wallet response based on a transaction ID.
 *
 * @interface GetWalletResponse
 * @description This interface defines a function that takes a transaction ID and an optional
 * response code, and returns a Promise resolving to a QueryResponse containing a WalletResponseTO.
 * It is typically used to fetch the response from a wallet after a transaction has been initiated.
 *
 * @param {TransactionId} transactionId - The unique identifier of the transaction for which
 * the wallet response is being requested.
 * @param {ResponseCode} [responseCode] - An optional response code that may be used to
 * provide additional context or filtering for the request.
 *
 * @returns {Promise<QueryResponse<WalletResponseTO>>} A promise that resolves to a QueryResponse
 * containing the WalletResponseTO. The QueryResponse can be in one of three states:
 * - NotFound: If no wallet response is found for the given transaction ID.
 * - InvalidState: If the wallet response is in an invalid or unexpected state.
 * - Found: Containing the WalletResponseTO with the actual wallet response data.
 *
 */
export interface GetWalletResponse {
  (transactionId: TransactionId, responseCode?: ResponseCode): Promise<
    QueryResponse<WalletResponseTO>
  >;
}
//@Expose({ name: 'wallet_response' })
// export class WalletResponseTO {
//   @Expose({ name: 'id_token' })
//   idToken?: string;

//   @Expose({ name: 'vp_token' })
//   vpToken?: string;

//   @Expose({ name: 'presentation_submission' })
//   @Type(() => PresentationSubmission)
//   presentationSubmission?: PresentationSubmission;

//   @Expose({ name: 'error' })
//   error?: string;

//   @Expose({ name: 'error_description' })
//   errorDescription?: string;

//   constructor(args: {
//     idToken?: string;
//     vpToken?: string;
//     presentationSubmission?: PresentationSubmission;
//     error?: string;
//     errorDescription?: string;
//   }) {
//     this.idToken = args.idToken;
//     this.vpToken = args.vpToken;
//     this.presentationSubmission = args.presentationSubmission;
//     this.error = args.error;
//     this.errorDescription = args.errorDescription;
//   }
// }

// export const toTo = (instance: WalletResponse): WalletResponseTO => {
//   if (instance instanceof WalletResponseNS.IdToken) {
//     return new WalletResponseTO({ idToken: instance.idToken });
//   }
//   if (instance instanceof WalletResponseNS.VpToken) {
//     return new WalletResponseTO({
//       vpToken: instance.vpToken,
//       presentationSubmission: instance.presentationSubmission,
//     });
//   }
//   if (instance instanceof WalletResponseNS.IdAndVpToken) {
//     return new WalletResponseTO({
//       idToken: instance.idToken,
//       vpToken: instance.vpToken,
//       presentationSubmission: instance.presentationSubmission,
//     });
//   }
//   if (instance instanceof WalletResponseNS.Error) {
//     return new WalletResponseTO({
//       error: instance.value,
//       errorDescription: instance.description,
//     });
//   }
//   throw new Error('Unsupported WalletResponse');
// };

// export class GetWalletResponseLive implements GetWalletResponse {
//   constructor(private loadPresentationById: LoadPresentationById) {}

//   async invoke(
//     transactionId: TransactionId,
//     responseCode?: ResponseCode
//   ): Promise<QueryResponse<WalletResponseTO>> {
//     const presentation = await this.loadPresentationById(transactionId);

//     switch (presentation instanceof PresentationNS.Submitted) {
//       case true:
//         const presentationResCode = (presentation as PresentationNS.Submitted)
//           .responseCode;

//         if (
//           (!presentationResCode && !!responseCode) ||
//           (!!presentationResCode && !responseCode)
//         ) {
//           return QueryResponse.InvalidState;
//         } else if (
//           (!presentationResCode && !responseCode) ||
//           presentationResCode?.value === responseCode?.value
//         ) {
//           return new QueryResponse.Found(
//             toTo((presentation as PresentationNS.Submitted).walletResponse)
//           );
//         } else {
//           return QueryResponse.InvalidState;
//         }
//       default:
//         switch (presentation) {
//           case undefined:
//             return QueryResponse.NotFound;
//           default:
//             return QueryResponse.InvalidState;
//         }
//     }
//   }
// }
