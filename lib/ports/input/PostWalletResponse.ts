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
import { Result } from 'oid4vc-core/utils';
import { AuthorizationResponse } from '../../domain';
import { WalletResponseAcceptedTO } from './PostWalletResponse.types';

export { WalletResponseAcceptedTO } from './PostWalletResponse.types';
/**
 *
 * The caller (wallet) may POST the [AuthorisationResponseTO] to the verifier back-end
 */
export interface PostWalletResponse {
  /**
   * Processes the wallet response and returns the accepted wallet response transfer object (TO) if successful.
   * @param {AuthorizationResponse} authorizationResponse - The wallet response received from the authorization endpoint.
   * @returns {Promise<Result<WalletResponseAcceptedTO | undefined>>} A promise that resolves to a Result object containing the accepted wallet response TO if successful, or an error if the processing fails. Returns undefined if the wallet response is not accepted.
   * @throws {Error} If an error occurs during the processing of the wallet response.
   */
  (authorizationResponse: AuthorizationResponse): Promise<
    Result<WalletResponseAcceptedTO | undefined>
  >;
}
