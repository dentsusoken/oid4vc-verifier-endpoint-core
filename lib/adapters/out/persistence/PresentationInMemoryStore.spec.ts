import { describe, it, expect, beforeEach } from 'vitest';
import { PresentationInMemoryStore } from './PresentationInMemoryStore';
import { Presentation, RequestId, TransactionId } from '../../../domain';

describe('PresentationInMemoryStore', () => {
  let store: PresentationInMemoryStore;

  beforeEach(() => {
    store = new PresentationInMemoryStore();
  });

  it('should store and load a presentation by id', async () => {
    const presentation = {
      __type: 'Requested',
      id: new TransactionId('1'),
      requestId: new RequestId('req1'),
      // Add other required properties
    } as Presentation;

    await store.storePresentation(presentation);
    const loadedPresentation = await store.loadPresentationById(
      presentation.id
    );

    expect(loadedPresentation).toEqual(presentation);
  });

  it('should load a presentation by request id', async () => {
    const presentation = {
      __type: 'Requested',
      id: new TransactionId('2'),
      requestId: new RequestId('req2'),
      // Add other required properties
    } as Presentation.Requested;

    await store.storePresentation(presentation);
    const loadedPresentation = await store.loadPresentationByRequestId(
      presentation.requestId
    );

    expect(loadedPresentation).toEqual(presentation);
  });

  it('should return undefined when loading a non-existent presentation by id', async () => {
    const nonExistentId = new TransactionId('non-existent');
    const loadedPresentation = await store.loadPresentationById(nonExistentId);

    expect(loadedPresentation).toBeUndefined();
  });

  it('should return undefined when loading a non-existent presentation by request id', async () => {
    const nonExistentRequestId = new RequestId('non-existent');
    const loadedPresentation = await store.loadPresentationByRequestId(
      nonExistentRequestId
    );

    expect(loadedPresentation).toBeUndefined();
  });
});
