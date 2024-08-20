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

import { TransactionId, Presentation, RequestId } from '../../../domain';
import {
  LoadPresentationById,
  LoadPresentationByRequestId,
  StorePresentation,
} from '../../../ports/out/persistence';

interface PresentationStoredEntry {
  presentation: Presentation;
  // Add other properties if needed
}

export class PresentationInMemoryStore {
  private presentations: Map<string, PresentationStoredEntry> = new Map();

  loadPresentationById: LoadPresentationById = async (
    presentationId: TransactionId
  ) => {
    const entry = this.presentations.get(presentationId.value);
    return entry ? entry.presentation : undefined;
  };

  loadPresentationByRequestId: LoadPresentationByRequestId = async (
    requestId: RequestId
  ) => {
    for (const entry of this.presentations.values()) {
      const presentation = entry.presentation;

      if (presentation.requestId.value === requestId.value) {
        return presentation;
      }
    }
    //console.log('requestId:', requestId);
    //console.log('presentations:', this.presentations.keys());
    return undefined;
  };

  storePresentation: StorePresentation = async (presentation: Presentation) => {
    const existing = this.presentations.get(presentation.id.value);
    this.presentations.set(
      presentation.id.value,
      existing ? { ...existing, presentation } : { presentation }
    );
  };
}

const store = new PresentationInMemoryStore();

export const createLoadPresentationByIdInMemoryInvoker =
  (): LoadPresentationById => store.loadPresentationById;

export const createLoadPresentationByRequestIdInMemoryInvoker =
  (): LoadPresentationByRequestId => store.loadPresentationByRequestId;

export const createStorePresentationInMemoryInvoker = (): StorePresentation =>
  store.storePresentation;
