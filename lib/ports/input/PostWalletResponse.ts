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
import { AuthorizationResponse } from '../../domain';
import { WalletResponseAcceptedTO } from './PostWalletResponse.types';

/**
 *
 * The caller (wallet) may POST the [AuthorisationResponseTO] to the verifier back-end
 */
export interface PostWalletResponse {
  /**
   * Posts the wallet response to the verifier back-end.
   *
   * @param walletResponse - The authorisation response from the wallet.
   * @returns A promise that resolves to WalletResponseAcceptedTO if the response is accepted, or undefined otherwise.
   * @throws WalletResponseValidationError if the wallet response fails validation.
   */
  (walletResponse: AuthorizationResponse): Promise<
    WalletResponseAcceptedTO | undefined
  >;
}
