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
import { Duration } from '../..';
import { TransactionId, PresentationNS } from '../../domain';
import {
  LoadIncompletePresentationsOlderThan,
  StorePresentation,
} from '../out/persistence';

export interface TimeoutPresentations {
  invoke(): Promise<TransactionId[]>;
}

export class TimeoutPresentationsLive implements TimeoutPresentations {
  constructor(
    private loadIncompletePresentationsOlderThan: LoadIncompletePresentationsOlderThan,
    private storePresentation: StorePresentation,
    private maxAge: Duration,
    private clock: Date
  ) {}

  async invoke(): Promise<TransactionId[]> {
    const expireBefore = new Date(this.clock.getTime() - this.maxAge);
    return (await this.loadIncompletePresentationsOlderThan(expireBefore))
      .map((it) => this.timeout(it)?.id)
      .filter((it) => !!it) as TransactionId[];
  }

  private timeout(presentation: Presentation): Presentation | null | undefined {
    const timeout = (() => {
      if (
        presentation instanceof PresentationNS.Requested ||
        presentation instanceof PresentationNS.RequestObjectRetrieved ||
        presentation instanceof PresentationNS.Submitted
      ) {
        return presentation.timedOut(this.clock).getOrNull();
      } else {
        return undefined;
      }
    })();
    timeout && this.storePresentation(timeout);
    return timeout;
  }
}
