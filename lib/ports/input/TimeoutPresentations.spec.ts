import { describe, expect, it, vi } from 'vitest';
import {
  EmbedOption,
  EphemeralEncryptionKeyPairJWK,
  GetWalletResponseMethod,
  Nonce,
  Presentation,
  PresentationType,
  RequestId,
  ResponseCode,
  ResponseModeOption,
  TransactionId,
  WalletResponse,
} from '../../domain';
import {
  PresentationDefinition,
  PresentationSubmission,
} from '../../../mock/prex';
import { TimeoutPresentationsLive } from './TimeoutPresentations';
import { LoadIncompletePresentationsOlderThan } from '../out/persistence';

const now = Date.now();

const requested = new Presentation.Requested(
  new TransactionId('test'),
  new Date(now - 20 * 60 * 1000),
  new PresentationType.VpTokenRequest(new PresentationDefinition()),
  new RequestId('test'),
  new Nonce('test'),
  new EphemeralEncryptionKeyPairJWK('test'),
  ResponseModeOption.DirectPostJwt,
  EmbedOption.ByValue,
  GetWalletResponseMethod.Redirect
);
const retrieve = requested
  .retrieveRequestObject(new Date(now - 20 * 60 * 1000))
  .getOrThrow();
const submitted = retrieve
  .submit(
    new Date(),
    new WalletResponse.VpToken('test', new PresentationSubmission()),
    new ResponseCode('test')
  )
  .getOrThrow();
const timedOut = requested.timedOut(new Date()).getOrThrow();

const testData: Presentation[] = [requested, retrieve, submitted, timedOut];

const loadIncompletePresentationsOlderThan: LoadIncompletePresentationsOlderThan =
  async (date: Date) => {
    return testData.filter((x) => x.isExpired(date));
  };

describe('TimeoutPresentations', () => {
  it('should invoke', async () => {
    const storePresentation = vi.fn();
    const maxAge = 10 * 60 * 1000;
    const clock = new Date();
    const timeoutPresentations = new TimeoutPresentationsLive(
      loadIncompletePresentationsOlderThan,
      storePresentation,
      maxAge,
      clock
    );
    const presentations = await timeoutPresentations.invoke();
    expect(presentations.length).toBe(3);
  });
  it('should not return unexpired presentations', async () => {
    const storePresentation = vi.fn();
    const maxAge = 10 * 60 * 1000;
    const clock = new Date();
    const loadIncompletePresentationsOlderThan = vi.fn().mockReturnValue([]);
    const timeoutPresentations = new TimeoutPresentationsLive(
      loadIncompletePresentationsOlderThan,
      storePresentation,
      maxAge,
      clock
    );
    const presentations = await timeoutPresentations.invoke();
    expect(presentations.length).toBe(0);
  });
  it('should return expired presentations', async () => {
    const storePresentation = vi.fn();
    const maxAge = 10 * 60 * 1000;
    const clock = new Date();
    const loadIncompletePresentationsOlderThan = vi
      .fn()
      .mockReturnValue([retrieve]);
    const timeoutPresentations = new TimeoutPresentationsLive(
      loadIncompletePresentationsOlderThan,
      storePresentation,
      maxAge,
      clock
    );
    const presentations = await timeoutPresentations.invoke();
    expect(presentations.length).toBe(1);
  });
});
