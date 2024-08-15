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

import { WalletResponse } from '../../domain';
import { WalletResponseTO } from '../../ports/input';

/**
 * Converts a WalletResponse object to a WalletResponseTO object.
 * @param {WalletResponse} walletResponse - The WalletResponse object to be converted.
 * @returns {WalletResponseTO} The converted WalletResponseTO object.
 */
export const toWalletResponseTO = (
  walletResponse: WalletResponse
): WalletResponseTO => {
  switch (walletResponse.__type) {
    case 'IdToken':
      return new WalletResponseTO({ idToken: walletResponse.idToken });
    case 'VpToken':
      return new WalletResponseTO({
        vpToken: walletResponse.vpToken,
        presentationSubmission: walletResponse.presentationSubmission,
      });
    case 'IdAndVpToken':
      return new WalletResponseTO({
        idToken: walletResponse.idToken,
        vpToken: walletResponse.vpToken,
        presentationSubmission: walletResponse.presentationSubmission,
      });
    case 'WalletResponseError':
      return new WalletResponseTO({
        error: walletResponse.value,
        errorDescription: walletResponse.description,
      });
  }
};
