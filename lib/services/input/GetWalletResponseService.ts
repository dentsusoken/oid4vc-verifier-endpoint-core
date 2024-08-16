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

import { Duration } from '../../domain';
import { QueryResponse, GetWalletResponse } from '../../ports/input';
import { LoadPresentationById } from '../../ports/out/persistence';
import { toWalletResponseTO } from './GetWalletResponseService.convert';

type CreateParams = {
  loadPresentationById: LoadPresentationById;
  now: () => Date;
  maxAge: Duration;
};

export const createGetWalletResponseInvoker =
  ({ loadPresentationById, now, maxAge }: CreateParams): GetWalletResponse =>
  async (transactionId, responseCode) => {
    const presentation = await loadPresentationById(transactionId);

    if (!presentation) {
      return new QueryResponse.NotFound(
        `Presentation not found for transactionId: ${transactionId}`
      );
    }

    if (presentation.__type !== 'Submitted') {
      return new QueryResponse.InvalidState(
        `Invalid presentation state. Expected 'Submitted', but found '${presentation.__type}'.`
      );
    }

    if (
      (!responseCode && presentation.responseCode) ||
      (responseCode && !presentation.responseCode) ||
      (responseCode &&
        presentation.responseCode &&
        responseCode.value !== presentation.responseCode.value)
    ) {
      return new QueryResponse.InvalidState(
        `Invalid response code. Expected '${presentation.responseCode}', but found '${responseCode}'.`
      );
    }

    const expired = presentation.initiatedAt.getTime() + maxAge.toMillis();
    const current = now().getTime();

    if (expired < current) {
      return new QueryResponse.InvalidState(
        `Presentation has expired. Current time: ${new Date(
          current
        ).toISOString()}, Initiated at: ${presentation.initiatedAt.toISOString()}, Valid until: ${new Date(
          expired
        ).toISOString()}.`
      );
    }

    return new QueryResponse.Found(
      toWalletResponseTO(presentation.walletResponse)
    );
  };
